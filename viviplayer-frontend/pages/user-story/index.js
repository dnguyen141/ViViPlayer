import React, { useState } from 'react';
import { Card } from 'antd';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import styles from './user-story.module.css'

const { TextArea } = Input;

//This is for the Tab Menu
const tabList = [
  {
    key: 'tab1',
    tab: 'User Story',
  },
  {
    key: 'tab2',
    tab: 'Satz',
  },
];

//content of the tab, below is html and css for the design
const contentList = {
  tab1: <div className={styles.card}>
    <div className={styles.cardstyle}>
      <h5 className="card-title">User Story</h5>
      <h6 className="card-subtitle mb-2 text-muted">Geben Sie ihre User Story hier ein.</h6>
      <form>
        <p>Damit
          <input className={styles.inputuser} placeholder="Bitte hier eingeben" type="text" id="my-text"></input>
        </p>
        <p>möchte ich als
          <input className={styles.inputuser} placeholder="Bitte hier eingeben" type="text" id="my-text2"></input>
        </p>
        <p style={{fontStyle:'italic'}}>
          z.B : <b>Damit</b> ich besser meinen Code ordnen kann, <b>möchte ich als </b>
          Programmierer eine App zur automatischen Codesortierung haben.
        </p>
        <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '10px' }}>Posten</button>
        <button type="reset" className="btn btn-secondary btn-sm" style={{ marginTop: '10px' , marginLeft: '5px'}}>Zurücksetzen</button>
      </form>
    </div>
  </div>,
  tab2: <div className={styles.card}>
    <div className={styles.cardstyle}>
      <h5 className="card-title">Kommentar</h5>
      <h6 className="card-subtitle mb-2 text-muted">Geben Sie ihren Komentar hier ein.</h6>
      <form>
        <div className="input-group">
          <textarea className="form-control" style={{ height: '160px' }}></textarea>
        </div>
        <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '10px' }}>Posten</button>
        <button type="reset" className="btn btn-secondary btn-sm" style={{ marginTop: '10px' , marginLeft: '5px'}}>Zurücksetzen</button>
      </form>
    </div>
  </div>,
};

const UserStory = (props) => {
  const [activeTabKey1, setActiveTabKey1] = useState('tab1');
  const onTab1Change = key => {
    setActiveTabKey1(key);
  };
 //Import CSS Bootstrap 4
  return (
    <div>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
          crossOrigin="anonymous" />
      </head>
      <body>
        <h2 style={{ fontSize: '50px', textAlign: 'center', paddingTop: '200px' }}>USER STORY</h2>
        <Card
          style={{ width: '100%', paddingLeft: '50px', paddingRight: '50px' }}
          tabList={tabList}
          activeTabKey={activeTabKey1}
          onTabChange={key => {
            onTab1Change(key);
          }}
        >
          {contentList[activeTabKey1]}
        </Card>
        <br />
        <br />

      </body>
    </div>
  );
};

UserStory.propTypes = {};

export default UserStory;
