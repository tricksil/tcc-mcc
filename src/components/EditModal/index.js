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
import { DeviceFactory } from '~/helpers/deviceFactory';
import { GraphContext } from '~/context/GraphContext';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title: {
    textTransform: 'capitalize',
  },
}));

const EditModal = forwardRef(({ data, removeData }, ref) => {
  const { addNodeRandom, editNode, editEdge, findEdge, isExecute } = useContext(
    GraphContext
  );
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState('');
  const [deviceChecked, setDeviceChecked] = useState('');
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [bandwidth, setBandwidth] = useState('');
  const [delay, setDelay] = useState('');
  const [quantity, setQuantity] = useState(5);
  const [bandwidthRandom, setBandwidthRandom] = useState('');
  const [delayRandom, setDelayRandom] = useState('');

  const [checked, setChecked] = useState(false);

  const toggleChecked = () => {
    setChecked((prev) => !prev);
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen((x) => !x);
    },
    close: () => {
      setOpen((x) => !x);
    },
  }));

  useEffect(() => {
    if (data.action === 'edit' && data.type === 'node') {
      const { label, image, ip: ipNode } = data.dataNode;
      setName(label);
      setDevice(image);
      if (ipNode) setIp(ipNode);
    }
    if (data.action === 'edit' && data.type === 'edge') {
      const edge = findEdge(data.dataNode.id);
      data.dataNode = { ...data.dataNode, ...edge };
      setName(edge.label);
      setBandwidth(edge.bandwidth);
      setDelay(
        !edge.delay?.includes('ms') ? edge.delay : edge.delay.replace('ms', '')
      );
    }
  }, [data, data.action, data.type, findEdge]);

  const handleChange = (event) => {
    setDevice(event.target.value);
  };
  const handleChangeDeviceCheck = (event) => {
    setDeviceChecked(event.target.value);
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
  const handleChangeQuantity = (event) => {
    setQuantity(Number(event.target.value));
  };

  const handleChangeBandwidth = (event) => {
    setBandwidth(event.target.value);
  };
  const handleChangeDelayRandom = (event) => {
    setDelayRandom(event.target.value);
  };

  const handleChangeBandwidthRandom = (event) => {
    setBandwidthRandom(event.target.value);
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

  function editEdgeGraph(edge) {
    const customEdge = {
      ...edge,
      label: name,
      bandwidth: Number(bandwidth),
      delay: `${delay}ms`,
    };
    editEdge(customEdge);
    removeData();
  }

  function editNodeModal(node) {
    const customNode = {
      ...node,
      label: name,
    };
    if (device !== switchDivice) {
      customNode.ip = ip;
      setIp('');
    }
    editNode(customNode);
    removeData();
  }

  function addNodesAndEdge(node) {
    const typeChoose = chooseTypeDevice(deviceChecked);
    const customNode = {
      shape: 'image',
      image: deviceChecked,
      size: 15,
      type: typeChoose,
    };
    const customEdge = {
      bandwidth: Number(bandwidthRandom),
      delay: `${delayRandom}ms`,
    };
    const graph = DeviceFactory(node?.id, quantity, customEdge, customNode);
    addNodeRandom(graph);
    removeData();
  }

  function clearStates() {
    setChecked(false);
    setDelayRandom('');
    setBandwidthRandom('');
    setQuantity(5);
    setDelay('');
    setBandwidth('');
    setName('');
    setDevice('');
    setDeviceChecked('');
    setOpen((x) => !x);
  }

  function builderNodesAndEdge(createNodesRandom) {
    return function (dataNode) {
      if (createNodesRandom) {
        addNodesAndEdge(dataNode);
      } else if (data.type === 'node' && data.action === 'edit') {
        editNodeModal(dataNode);
      } else if (data.type === 'edge' && data.action === 'edit') {
        editEdgeGraph(dataNode);
      }
    };
  }

  function handleSubmit() {
    const { dataNode } = data;
    builderNodesAndEdge(checked)(dataNode);
    clearStates();
  }

  const handleClose = () => {
    removeData();
    clearStates();
  };

  function renderCheckedRandom() {
    return (
      <>
        <h3>Node</h3>
        <TextField
          margin="dense"
          id="quantity"
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={handleChangeQuantity}
          autoComplete="off"
          aria-autocomplete="none"
        />
        <FormControl className={classes.formControl} fullWidth margin="dense">
          <InputLabel id="type">Type</InputLabel>
          <Select
            labelId="type"
            id="type"
            value={deviceChecked}
            onChange={handleChangeDeviceCheck}
            fullWidth
          >
            <MenuItem value={phone}>Smartphone</MenuItem>
            <MenuItem value={server}>Server</MenuItem>
          </Select>
        </FormControl>
        <h3>Edge</h3>
        <TextField
          margin="dense"
          id="delayRandom"
          label="Delay(ms)"
          type="text"
          fullWidth
          value={delayRandom}
          onChange={handleChangeDelayRandom}
          autoComplete="off"
          aria-autocomplete="none"
        />
        <TextField
          margin="dense"
          id="bandwidthRandom"
          label="Bandwidth"
          type="text"
          fullWidth
          value={bandwidthRandom}
          onChange={handleChangeBandwidthRandom}
          autoComplete="off"
          aria-autocomplete="none"
        />
      </>
    );
  }

  function renderNodeOptions() {
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
    );
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
            disabled
          >
            <MenuItem value={phone}>Smartphone</MenuItem>
            <MenuItem value={switchDivice}>Switch</MenuItem>
            <MenuItem value={server}>Server</MenuItem>
          </Select>
        </FormControl>

        {device && device !== switchDivice && renderNodeOptions()}

        {data.dataNode.type === 'switch' && (
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  size="medium"
                  checked={checked}
                  onChange={toggleChecked}
                />
              }
              label="add nodes"
              labelPlacement="start"
            />
          </FormGroup>
        )}

        {checked && renderCheckedRandom()}
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

EditModal.displayName = 'EditModal';

EditModal.propTypes = {
  removeData: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default EditModal;
