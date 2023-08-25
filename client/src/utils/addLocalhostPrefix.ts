const addLocalhostPrefix = (subPath: string) =>
  `http://localhost:5000/${subPath}`;

export default addLocalhostPrefix;
