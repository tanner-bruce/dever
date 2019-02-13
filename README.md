# Dever

Dever is a Chrome and Firefox extension along with a Go backend server that
adds a button to GitLab and GitHub that when clicked will instantly clone
that repo to ~/src/<github.com>/<user>/<repo>

## Getting Started

Getting started is simple, the only requirement is Docker. To run the server,
docker-compose can be used. The following command will start Dever in daemon
mode, which will attempt to always keep it running.

```bash
# docker-compose up -d
```

To install the Chrome extension, browse to chrome://extensions, and enable the
developer mode. From here, select `Load Unpacked`, then browse to the `chrome-extension`
folder inside of the repo. Install this, and then everything should be running.
