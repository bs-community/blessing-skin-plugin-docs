const React = require('react');

class Footer extends React.PureComponent {
  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <div>
            <h5>其它</h5>
            <a
              href="https://github.com/printempw/blessing-skin-server"
              target="_blank">
              Blessing Skin Server 官方 GitHub
            </a>
          </div>
          <div>
            <h5>更多</h5>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count={true}
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
          </div>
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
