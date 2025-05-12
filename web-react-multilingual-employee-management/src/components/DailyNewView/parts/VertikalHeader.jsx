import React, { useState, useRef, useCallback, useEffect } from 'react';

const time = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const startOfDay = 8;

const VerticalHeader = (props) => {
  const { items } = props;
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Header jsons={items} />
      {time.map((i, idx) => {
        return (
          <div
            key={idx}
            style={{
              width: '100vw',
              border: '1px gray solid',
              height: '10vh',
              display: 'flex',
              backgroundColor: 'white',
            }}
          >
            <div style={{ width: '13.5vw', margin: '10px', textAlign: 'center' }}>{i}AM</div>
          </div>
        );
      })}
    </div>
  );
};

const Header = (props) => {
  const { jsons } = props;
  return (
    <div style={{ width: '100vw', height: '15vh', display: 'flex', backgroundColor: 'white' }}>
      <div
        style={{
          width: '15vw',
          color: '#0065B1',
          paddingRight: '5px',
          paddingTop: '10px',
          border: '1px  gray',
        }}
      >
        Timelines
      </div>
      {jsons.map((obj, idx) => {
        return (
          <div
            style={{
              width: '7vh',
              color: '#455768',
              height: '15vh',
              textAlign: 'left',
              border: '1px solid black',
            }}
          >
            <div
              style={{
                width: '10vw',
                textAlign: 'left',
                fontSize: '12px',
                transform: 'rotate(270deg)',
              }}
              key={idx}
            >
              {obj.user.full_name}
            </div>
            {obj.processes.map((pro, j) => {
              return (
                <div>
                  <div
                    style={{
                      width: `${(pro.process.start_time - startOfDay) * 10}vw`,
                      height: '15vh',
                      transform: 'rotate(270deg)',
                    }}
                  ></div>
                  <div>
                    <div
                      style={{
                        height: `${pro.process.actual_duration * 10}vh`,
                        position: 'relative',
                        right: '-5px',
                        borderRadius: '50px 50px 50px 50px',
                        border: '1px black solid',
                        paddingTop: '1px',
                        overflow: 'hidden',
                        backgroundColor: `${pro.process.color}`,
                        paddingRight: '10px',
                        boxShadow: ' 0.1rem 0.3rem  #ccc',
                        width: '40px',
                        color: 'black',
                        marginRight: '45px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          marginTop: '15px',
                          textAlign: 'center',
                          width: 'calc(100% - 5px)',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                      >
                        {pro.process.process_name}
                      </div>
                      <div
                        className="underline"
                        style={{
                          height: '100%',
                          background: 'white',
                          width: '3px',
                          /* border-radius: 0px 0px 0px 100px; */
                          borderBottomLeftRadius: '100% 3rem',
                          borderBottomRightRadius: '100% 3rem',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default VerticalHeader;
