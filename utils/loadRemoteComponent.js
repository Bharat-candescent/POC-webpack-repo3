export const loadRemoteComponent = async (remoteName, exposedModule) => {
  try {
    await __webpack_init_sharing__('default'); // sets up the shared module scope b/w host & remotes
    const container = window[remoteName]; // get access to remote container loaded by remoteEntry.js
    if (!container) {
      throw new Error(`Remote ${remoteName} not found on window`); //If remote is not found
    }

    await container.init(__webpack_share_scopes__.default); // Passes the shared modules to the remote container
    const factory = await container.get(exposedModule); // get the actual module exposed by the remote
    const Module = factory(); // execute the factory to get the module
    return Module; // return the module/component
  } catch (error) {
    console.error(`Failed to load remote ${remoteName}`, error);
    return null;
  }
};
