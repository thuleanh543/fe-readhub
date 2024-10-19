import React from 'react'
import {ReactReader} from 'react-reader'

const ReaderContent = ({
  epubUrl,
  location,
  onLocationChanged,
  onGetRendition,
  onError,
  readerStyles,
}) => (
  <div style={{flex: 1, position: 'relative'}}>
    <ReactReader
      url={epubUrl}
      epubOptions={{
        allowPopups: true,
        allowScriptedContent: true,
      }}
      location={location}
      locationChanged={onLocationChanged}
      getRendition={onGetRendition}
      handleError={onError}
      readerStyles={readerStyles}
    />
  </div>
)
export default ReaderContent
