import { theme } from 'themes';

export const classes = {
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#DADADA',
    borderStyle: 'dashed',
    color: '#828282',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    marginTop: '12px',
    height: '172px'
  },

  active: {
    borderColor: theme.palette.success.main
  },

  accept: {
    borderColor: '#00e676'
  },

  reject: {
    borderColor: theme.palette.error.main
  },
  btnUpload: {
    fontWeight: 500,
    marginBottom: '12px',
    color: theme.palette.secondary.main,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.palette.secondary.main,
    borderStyle: 'solid',
    minHeight: '38px',
    minWidth: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  thumb: {
    display: 'inline-flex',
    justifyContent: 'center',
    borderRadius: 4,
    border: '1px solid #eaeaea',
    width: 200,
    height: 200,
    padding: 4
  },

  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },

  img: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }
};
