/* eslint-disable func-names */
import PropTypes from 'prop-types';
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Switch,
  FormGroup,
  FormControlLabel,
  Divider,
} from '@material-ui/core';

import phone from '~/assets/phone.svg';
import server from '~/assets/server.svg';
import switchDivice from '~/assets/switch.svg';
import { createDimage, DeviceFactory } from '~/helpers/deviceFactory';
import { GraphContext } from '~/context/GraphContext';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title: {
    textTransform: 'capitalize',
  },
}));

const AddModal = forwardRef(({ data, removeData }, ref) => {
  const { createNode, createEdge } = useContext(GraphContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState('');
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [bandwidth, setBandwidth] = useState('');
  const [delay, setDelay] = useState('');

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen((x) => !x);
    },
    close: () => {
      setOpen((x) => !x);
    },
  }));

  const handleClose = () => {
    removeData();
    setOpen((x) => !x);
    setName('');
    setDevice('');
    setIp('');
  };

  const handleChange = (event) => {
    setDevice(event.target.value);
  };

  const handleChangeName = (event) => {
    setName(event.target.value.split(' ').join(''));
  };
  const handleChangeIp = (event) => {
    setIp(event.target.value);
  };

  const handleChangeDelay = (event) => {
    setDelay(event.target.value);
  };

  const handleChangeBandwidth = (event) => {
    setBandwidth(event.target.value);
  };

  function chooseTypeDevice(typeParam) {
    switch (typeParam) {
      case phone:
        return 'client';
      case server:
        return 'server';
      default:
        return 'switch';
    }
  }

  function saveEdge(edge) {
    const customEdge = {
      ...edge,
      label: name,
      bandwidth: Number(bandwidth),
      delay: `${delay}ms`,
      title: `<p>Delay: ${delay}ms<br>Bandwidth: ${bandwidth}</p>`,
    };
    createEdge(customEdge);
    removeData();
  }

  function saveNode(node) {
    const typeChoose = chooseTypeDevice(device);
    const nodeIndex = node.id.split('-')[0];
    const customNode = {
      ...node,
      id: nodeIndex,
      label: typeChoose !== 'switch' ? name : nodeIndex,
      title: `Name: ${typeChoose !== 'switch' ? name : nodeIndex}`,
      shape: 'image',
      image: device,
      size: 15,
      type: typeChoose,
    };
    if (device !== switchDivice) {
      customNode.ip = ip;
      customNode.title = `${customNode.title}<br>IP: ${ip}`;
      setIp('');
    }
    if (typeChoose !== 'switch') {
      customNode.dimage = createDimage(name)(typeChoose);
      customNode.title = `${customNode.title}<br>Image: ${customNode.dimage}`;
    }
    createNode(customNode);
    removeData();
  }

  function clearStates() {
    setDelay('');
    setBandwidth('');
    setName('');
    setDevice('');
    setOpen((x) => !x);
  }

  function builderNodesAndEdge() {
    return function (dataNode) {
      if (data.type === 'node' && data.action === 'add') {
        saveNode(dataNode);
      } else if (data.type === 'edge' && data.action === 'add') {
        saveEdge(dataNode);
      }
    };
  }

  function handleSubmit() {
    const { dataNode } = data;
    builderNodesAndEdge()(dataNode);
    clearStates();
  }

  function renderNode() {
    return (
      <>
        <FormControl className={classes.formControl} fullWidth margin="dense">
          <InputLabel id="type">Type</InputLabel>
          <Select
            labelId="type"
            id="type"
            value={device}
            onChange={handleChange}
            fullWidth
            disabled={data?.action === 'edit'}
          >
            <MenuItem value={phone}>Smartphone</MenuItem>
            <MenuItem value={switchDivice}>Switch</MenuItem>
            <MenuItem value={server}>Server</MenuItem>
          </Select>
        </FormControl>

        {device && device !== switchDivice && (
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={handleChangeName}
            autoComplete="off"
            aria-autocomplete="none"
          />
        )}

        {device && device !== switchDivice && (
          <>
            <TextField
              autoFocus
              margin="dense"
              id="ip"
              label="Ip Address"
              type="text"
              autoComplete="off"
              fullWidth
              value={ip}
              onChange={handleChangeIp}
              aria-autocomplete="none"
            />
          </>
        )}
      </>
    );
  }

  function renderEdge() {
    return (
      <>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={handleChangeName}
          autoComplete="off"
          aria-autocomplete="none"
        />
        <TextField
          margin="dense"
          id="delay"
          label="Delay(ms)"
          type="text"
          fullWidth
          value={delay}
          onChange={handleChangeDelay}
          autoComplete="off"
          aria-autocomplete="none"
        />
        <TextField
          margin="dense"
          id="bandwidth"
          label="Bandwidth"
          type="text"
          fullWidth
          value={bandwidth}
          onChange={handleChangeBandwidth}
          autoComplete="off"
          aria-autocomplete="none"
        />
      </>
    );
  }

  return (
    <>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="customized-dialog-title" className={classes.title}>
            {data.type}
          </DialogTitle>
          <DialogContent>
            {data?.type === 'node' && renderNode()}
            {data?.type === 'edge' && renderEdge()}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {`${data.action} ${data.type}`}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

AddModal.displayName = 'AddModal';

AddModal.propTypes = {
  removeData: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default AddModal;
