import axios from "axios";
import React, { useEffect, useState } from "react";
import { CLOUDFLARE_WORKER_DOMAIN, COTTER_API_KEY_ID } from "../../constants";
import "./styles.css";

import "react-dates/initialize";
import moment from "moment";
import { SingleDatePicker } from "react-dates";
import { ANCHOR_LEFT } from "react-dates/constants";
import "react-dates/lib/css/_datepicker.css";

const optionTimes = (start, end, duration) => {
  duration = parseInt(duration);
  let currHour = start;
  let currMinute = 0;
  let options = [];
  while (currHour <= end) {
    while (currMinute < 60) {
      const newOpt = `${currHour}:${
        currMinute < 10 ? `0${currMinute}` : currMinute
      }`;
      options.push(newOpt);
      console.log(options);
      currMinute = currMinute + duration;
    }
    currHour = currHour + 1;
    currMinute = 0;
  }
  return options;
};

const getEndTime = (startTime, duration) => {
  duration = parseInt(duration);
  let [hour, min] = startTime.split(":");
  [hour, min] = [parseInt(hour), parseInt(min)];
  min = min + duration;
  if (min >= 60) {
    hour = hour + 1;
    min = 0;
  }
  return `${hour}:${min < 10 ? `0${min}` : min}`;
};

function BookingPage({ identifier, duration }) {
  const [user, setuser] = useState(null);
  const [err, seterr] = useState(null);
  const [loading, setloading] = useState(false);
  const [success, setsuccess] = useState(false);

  const [timeOptions, settimeOptions] = useState([]);

  // Booking form input
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [startDate, setstartDate] = useState(moment());
  const [startTime, setstartTime] = useState("");

  useEffect(() => {
    if (identifier) {
      getUserInformation();
    }
  }, [identifier]);

  useEffect(() => {
    if (duration) {
      settimeOptions(optionTimes(9, 16, duration));
    }
  }, [duration]);

  // Get information of the user who shared this booking link
  const getUserInformation = async () => {
    try {
      const resp = await axios.get(
        `https://www.cotter.app/api/v0/user?identifier=${encodeURIComponent(
          identifier
        )}`,
        {
          headers: {
            API_KEY_ID: COTTER_API_KEY_ID,
          },
        }
      );
      setuser(resp?.data);
    } catch (e) {
      seterr(JSON.stringify(e));
    }
  };

  // Book the calendar of the user who shared this booking link
  const bookCalendar = async () => {
    seterr(null);
    if (loading) return;
    if (!name || !email || !startDate || !startTime) {
      seterr("Please fill all the fields");
      return;
    }
    setloading(true);
    const [startHour, startMin] = startTime.split(":");
    const [endHour, endMin] = getEndTime(startTime, duration).split(":");
    try {
      const resp = await axios.post(
        `https://createevent.${CLOUDFLARE_WORKER_DOMAIN}?user_id=${user?.ID}`,
        {
          start_time: startDate
            .set("hour", parseInt(startHour))
            .set("minute", parseInt(startMin))
            .set("second", 0)
            .format(),
          end_time: startDate
            .set("hour", parseInt(endHour))
            .set("minute", parseInt(endMin))
            .set("second", 0)
            .format(),
          attendee_email: email,
          meeting_title: `${identifier} <> ${name}`,
        }
      );
      setloading(false);
      setsuccess(true);
    } catch (e) {
      setloading(false);
      setsuccess(false);
      seterr(JSON.stringify(e));
    }
  };

  return (
    <div className="BookingPage__container container is-max-desktop">
      <div className="BookingPage__body-container">
        <div className="columns">
          {/* Left Column */}
          <div className={`column ${!success && "is-one-quarter"}`}>
            <div className="BookingPage__bookform box">
              <div className="BookingPage__avatar" />
              <div className="BookingPage__label-container">
                <div className="BookingPage__title">{duration}min Meeting</div>
                <div className="BookingPage__label-container">
                  <div className="BookingPage__label">with</div>
                  <div className="BookingPage__subtitle">{identifier}</div>
                </div>
                {startDate && startTime ? (
                  <div className="BookingPage__label-container">
                    <div className="BookingPage__label">on</div>
                    <div className="BookingPage__subtitle has-text-weight-bold has-text-success">
                      <i className="fas fa-calendar"></i>{" "}
                      {startDate.format("LL")}
                    </div>
                    <div className="BookingPage__subtitle has-text-weight-bold has-text-success">
                      <i className="fas fa-clock"></i> {startTime} -{" "}
                      {getEndTime(startTime, duration)}
                    </div>
                  </div>
                ) : null}

                {success ? (
                  <>
                    <div className="BookingPage__label-container">
                      <div className="BookingPage__label">Meeting Title</div>
                      <div className="BookingPage__subtitle">
                        {identifier} {"<>"} {name}
                      </div>
                    </div>
                    <div className="BookingPage__label-container">
                      <div className="BookingPage__label">Attendees</div>
                      <div className="BookingPage__subtitle">
                        <ul>
                          <li>{identifier}</li>
                          <li>{email}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="BookingPage__label-container">
                      <div className="BookingPage__subtitle has-text-weight-bold has-text-success">
                        <i className="fas fa-check-circle"></i> Meeting
                        Scheduled
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right Column */}
          {!success && (
            <div className="column">
              <div className="BookingPage__bookform box">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    bookCalendar();
                  }}
                >
                  <div className="BookingPage__section">
                    <div className="title is-5">Name</div>
                    <input
                      className="input"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                      type="text"
                      placeholder="Your Name"
                    ></input>
                  </div>
                  <div className="BookingPage__section">
                    <div className="title is-5">Email</div>
                    <input
                      className="input"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      type="email"
                      placeholder="youremail@gmail.com"
                    ></input>
                  </div>
                  <div className="BookingPage__section columns">
                    <div className="column">
                      <div className="title is-5">Select Date</div>
                      <SingleDatePicker
                        date={startDate} // momentPropTypes.momentObj or null
                        onDateChange={(ndate) => setstartDate(ndate)} // PropTypes.func.isRequired
                        focused={true} // PropTypes.bool
                        onFocusChange={({ focused }) => {}} // PropTypes.func.isRequired
                        id={`date-picker`} // PropTypes.string.isRequired,
                        small={true}
                        numberOfMonths={1}
                        showClearDate={true}
                        anchorDirection={ANCHOR_LEFT}
                        placeholder={"Never"}
                        hideKeyboardShortcutsPanel={true}
                      />
                    </div>

                    <div className="column">
                      <div className="title is-5">Select Time</div>
                      <div className="BookingPage__timeselect">
                        {timeOptions?.map((t) => (
                          <div
                            className={`button is-fullwidth is-success ${
                              startTime !== t && "is-light"
                            }`}
                            onClick={() => setstartTime(t)}
                          >
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {err && (
                    <article className="message is-danger">
                      <div className="message-body">{err}</div>
                    </article>
                  )}
                  <button
                    className={`button is-success ${loading && "is-loading"}`}
                    disabled={
                      !name || !email || !startDate || !startTime || loading
                    }
                    type="submit"
                  >
                    Schedule Meeting
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// This page DOES NOT REQUIRE ATTENDEES TO BE LOGGED-IN
export default BookingPage;
