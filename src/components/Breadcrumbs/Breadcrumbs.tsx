import { Breadcrumbs, Typography, Link } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function BreadCrumbs(props: { location: { pathname: string }}) {
  console.log(props);
  const history = useHistory();
  const { location } = props;
  const { pathname } = location;
  console.log(pathname);
  return (
    <div className="breadcrumbs-wrapper">
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" onClick={() => history.push('/')} className="breadcrumb-link">
          Menu
        </Link>
        <Typography color="textPrimary" className="breadcrumb-page">{pathname.split('/')[1]}</Typography>
      </Breadcrumbs>
    </div>
  );
}
