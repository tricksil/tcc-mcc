import { useHistory } from 'react-router-dom';

import { useContext, useRef } from 'react';
import Styles from './styles';

import cloud from '~/assets/cloud_1.svg';
import { GraphContext } from '~/context/GraphContext';
import { SnackbarContext } from '~/context/SnackContext';

function Home() {
  const uploadRef = useRef();
  const history = useHistory();
  const { convertionalScenaryToVis } = useContext(GraphContext);
  const { snackBarOpen } = useContext(SnackbarContext);

  function handleCreateScenery() {
    history.push('/network');
  }

  function upload() {
    uploadRef.current.click();
  }

  function openFile(evt) {
    const fileObj = evt.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
      const json = atob(event.target.result.substring(29));
      convertionalScenaryToVis(json);
      snackBarOpen('Updload success', 'success');
      handleCreateScenery();
    });
    reader.readAsDataURL(fileObj);
  }

  return (
    <Styles.Container>
      <Styles.ContentImage>
        <Styles.ImageCloud src={cloud} alt="Cloud" />
        <h1>MCC Network</h1>
      </Styles.ContentImage>
      <Styles.ContentOptions>
        <Styles.BoardOptions>
          <Styles.BoardButton type="button" onClick={handleCreateScenery}>
            Build scenery
          </Styles.BoardButton>
          <Styles.BoardButton type="button" onClick={upload}>
            Upload Scenery
          </Styles.BoardButton>

          <Styles.BoardButton type="button">Search Scenery</Styles.BoardButton>
          <input
            type="file"
            className="hidden"
            multiple={false}
            accept=".json"
            onChange={(evt) => openFile(evt)}
            ref={uploadRef}
          />
        </Styles.BoardOptions>
      </Styles.ContentOptions>
    </Styles.Container>
  );
}

export default Home;
