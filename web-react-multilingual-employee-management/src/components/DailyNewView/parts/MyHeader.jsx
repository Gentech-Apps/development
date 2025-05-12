import React, { useState, useRef, useCallback, useEffect } from 'react';

const json = [
  {
    user_name: 'Andry',
    start_time: 10,
    duration: '3',
    process_name: 'process 1',
  },
  {
    user_name: 'Mark',
    start_time: 13,
    duration: '2',
    process_name: 'process 2',
  },
  {
    user_name: 'Vlad',
    start_time: 9,
    duration: '1',
    process_name: 'process 3',
  },
  {
    user_name: 'David',
    start_time: 9,
    duration: '4',
    process_name: 'process 4',
  },
  {
    user_name: 'Abdi',
    start_time: 10,
    duration: '6',
    process_name: 'process 5',
  },
];

const time = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const startOfDay = 8;

const MyHeader = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Header time={time} />
      {json.map((i, idx) => {
        return (
          <div key={idx} style={{ width: '100vw', height: '10vh', display: 'flex' }}>
            <div
              style={{
                width: '13.5vw',
                margin: '10px',
              }}
            >
              {i.user_name}
            </div>
            <div
              style={{
                width: `${(i.start_time - startOfDay) * 10}vw`,
                height: '8vh',
              }}
            />
            <div>
              <div
                style={{
                  width: `${i.duration * 10}vw`,
                  borderRadius: '50px 50px 50px 50px',
                  border: '1px black solid',
                  paddingTop: '1px',
                  backgroundColor: 'white',
                  paddingRight: '10px',
                  boxShadow: ' 0.1rem 0.3rem  #ccc',
                }}
              >
                {i.process_name}
              </div>
              <div
                className="underline"
                style={{
                  height: '3px',
                  background: 'blue',
                  width: '98%',
                  /* border-radius: 0px 0px 0px 100px; */
                  borderBottomLeftRadius: '100% 3rem',
                  borderBottomRightRadius: '100% 3rem',
                  marginLeft: '-5px',
                  marginRight: '3px',
                  marginTop: '-3px',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Header = (props) => {
  const { time } = props;
  return (
    <div style={{ width: '100vw', height: '10vh', display: 'flex' }}>
      <div
        style={{
          width: '20vw',
          color: '#0065B1',
          paddingRight: '5px',
          paddingTop: '10px',
          border: '1px solid black',
        }}
      >
        Timelines
      </div>
      {time.map((time_value, idx) => {
        return (
          <div
            style={{
              width: '10vw',
              color: '#455768',
              textAlign: 'center',
              border: '1px solid black',
            }}
          >
            <div style={{ paddingTop: '5px', fontSize: '18px' }} key={idx}>
              {time_value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyHeader;
