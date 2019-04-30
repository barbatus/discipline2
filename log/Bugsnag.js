import { Client, Configuration } from 'bugsnag-react-native';

const Bugsnag = {
  client: null,
  init(apiKey: string, env: string) {
    if (!this.client) {
      const config = new Configuration();
      config.apiKey = apiKey;
      config.notifyReleaseStages = ['beta', 'prod'];
      config.releaseStage = env;
      this.client = new Client(config);
    }
  },
  notify(error) {
    if (this.client) {
      this.client.notify(error);
    }
  }
};

export default Bugsnag;
