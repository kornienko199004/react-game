import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import StorageService from '../../common/services/storage.service';
import { IGameStatistics } from '../../common/models/models';
import moment from 'moment';

const useStyles = makeStyles({
  table: {
    minWidth: 375,
  },
});

export default function Statistics(props: { storageService: StorageService }) {
  const classes = useStyles();
  const statistics: IGameStatistics[] = props.storageService.getStatisticsData() || [];
  const dataSource: IGameStatistics[] = statistics.slice().sort((a, b) => b.score - a.score).slice(0, 10);
  console.log(statistics);
  return (
    <div className="statistics-wrapper">
      <h1>Statistics</h1>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>№</TableCell>
            <TableCell align="center">Player&nbsp;Name</TableCell>
            <TableCell align="center">Score</TableCell>
            <TableCell align="center">Field&nbsp;Size</TableCell>
            <TableCell align="center">Attempts</TableCell>
            <TableCell align="center">Time&nbsp;(sec)</TableCell>
            <TableCell align="center">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataSource.map((row: IGameStatistics, index: number) => (
            <TableRow key={row.createAt}>
              <TableCell component="th" scope="row" align="left"><b>{index + 1}</b></TableCell>
              <TableCell align="center">
                {row.playerName}
              </TableCell>
              <TableCell align="center">{row.score}</TableCell>
              <TableCell align="center">{row.fieldSize}</TableCell>
              <TableCell align="center">{row.attempts}</TableCell>
              <TableCell align="center">{row.time}</TableCell>
              <TableCell align="center">{moment(row.createAt).format('MMMM Do YYYY, HH:mm:ss')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
