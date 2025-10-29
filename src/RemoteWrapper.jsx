// components/RemoteWrapper.jsx
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { loadRemoteComponent } from '../utils/loadRemoteComponent';

const RemoteWrapper = ({ remoteName, exposedModule, fallback, errorFallback }) => {
  const [Component, setComponent] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadRemoteComponent(remoteName, exposedModule)
      .then((mod) => {
        if (mod) {
          setComponent(() => mod.default || mod);
        } else {
          setHasError(true);
        }
      })
      .catch(() => setHasError(true));
  }, [remoteName, exposedModule]);

  if (hasError) return errorFallback || <div>Failed to load {remoteName}</div>;
  if (!Component) return fallback || <div>Loading...</div>;

  return <Component />;
};

export default RemoteWrapper;
