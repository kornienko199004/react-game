import React from 'react';

export default function Footer(props: { logo: string }) {
  return (
    <div className="footer">
      <div className="footer__inner">
        <p className="feedback">
          Made by <a href="https://github.com/kornienko199004" rel="noreferrer" target="_blank">kornienko199004</a> for
    </p>
        <div className="rsschool-logo">
          <a href="https://rs.school/js/" rel="noreferrer" target="_blank">
            <img src={props.logo} alt="rsschool" />
          </a>
        </div>
      </div>
    </div>
  );
}
