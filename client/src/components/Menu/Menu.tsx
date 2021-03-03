import React from 'react';
import { routes } from '../../common/models/models';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 500,
      backgroundColor: theme.palette.background.paper,
      margin: '0 auto',
      marginTop: '70px',
      boxShadow: '0 0 5px rgb(0, 0, 0, 0.7)',
      borderRadius: '5px',
      color: '#000',
    },
  }),
);

interface IProps {
  resumeHandler(): void;
  isPaused: boolean;
  navigationLinkHandler(e: React.MouseEvent, path: string, button: string): void;
}

function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
  return <ListItem button component="a" {...props} />;
}

export default function Menu(props: IProps) {
  const classes = useStyles();
  const { resumeHandler, isPaused, navigationLinkHandler } = props;

  return (
    <div className={classes.root}>
      <h1>Menu</h1>
      <List component="nav" aria-label="secondary mailbox folders">
        {isPaused && 
          (<ListItem button onClick={resumeHandler}>
            <ListItemText primary="Resume" />
          </ListItem>)
        }
        {routes.map(({ button, path }) => (
          <ListItemLink key={path} href={path} onClick={(e: React.MouseEvent) => navigationLinkHandler(e, path, button)}>
            <ListItemText primary={button} />
        </ListItemLink>
        ))}
      </List>
    </div>
  );
}
