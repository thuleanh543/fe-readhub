import React from 'react'
import { useRef } from 'react';
import {ReactReader} from 'react-reader'

const ReaderContent = ({
  epubUrl,
  location,
  onLocationChanged,
  onGetRendition,
  onError,
  readerStyles,
  totalPages,
  setTotalPages
}) =>{ 
  const readerRef = useRef(null);

  return (
    <div style={{flex: 1, position: 'relative'}}>
      <ReactReader
        ref={readerRef}
        url={epubUrl}
        epubOptions={{
          allowPopups: true,
          allowScriptedContent: true,
        }}
        location={location}
        locationChanged={onLocationChanged}
        getRendition={rendition => {
          onGetRendition(rendition);
          
          // Khởi tạo locations khi book đã sẵn sàng
          rendition.book.ready.then(() => {
            rendition.book.locations.generate(1024).then(() => {
              const totalLocs = rendition.book.locations.total;
              setTotalPages(totalLocs);
            });
          });
        }}
        handleError={onError}
        readerStyles={readerStyles}
      />
    </div>
  );
}
export default ReaderContent
