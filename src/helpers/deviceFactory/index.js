/* eslint-disable func-names */
import { v4 } from 'uuid';
import faker from 'faker';
import PropTypes from 'prop-types';

const symbolsArray = ["'", '"', '.', ' ', ','];

export function removeSymbols(symbols) {
  return function (text) {
    return symbols.reduce((acc, simbolo) => acc.replace(simbolo, ''), text);
  };
}

function createName() {
  return function (type) {
    const name =
      type === 'client' ? faker.name.firstName() : faker.random.word();
    return removeSymbols(symbolsArray)(name).toLowerCase();
  };
}

export function createDimage() {
  return function (type) {
    if (type === 'client') {
      return `renanalves/android-22:vnc`;
    }
    return `renanalves/server-testbed`;
  };
}
export function DeviceFactory(nodeConnect, quantity, customEdge, customNode) {
  const nodes = new Array(quantity).fill().map((value) => {
    const name = createName()(customNode.type);
    const dimage = createDimage()(customNode.type);
    const ip = faker.internet.ip();
    return {
      ...value,
      ...customNode,
      id: v4().split('-')[0],
      label: name,
      dimage,
      ip,
      title: `Name: ${name}<br>Ip: ${ip}<br>Image: ${dimage}`,
    };
  });

  const edges = nodes.map((value) => ({
    ...customEdge,
    from: value.id,
    to: nodeConnect,
    title: `<p>Delay: ${customEdge.delay}ms<br>Bandwidth: ${customEdge.bandwidth}</p>`,
  }));

  return {
    nodes,
    edges,
  };
}

DeviceFactory.propTypes = {
  nodeConnect: PropTypes.oneOfType([PropTypes.object]),
  quantity: PropTypes.number,
  customEdge: PropTypes.oneOfType([PropTypes.object]),
  customNode: PropTypes.oneOfType([PropTypes.object]),
};
