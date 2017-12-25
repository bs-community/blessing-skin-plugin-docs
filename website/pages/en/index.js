/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

class HomeSplash extends React.Component {
  render() {
    return (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">
            <div className="inner">
              <h2 className="projectTitle">
                {siteConfig.title}
                <small>{siteConfig.tagline}</small>
              </h2>
              <div className="section promoSection">
                <div className="promoRow">
                  <div className="pluginRowBlock">
                    <Button
                      href={
                        siteConfig.baseUrl + 'docs/structure.html'
                      }>
                      开始学习开发插件
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Index extends React.PureComponent {
  render() {
    let language = this.props.language || 'en';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Container padding={['bottom', 'top']}>
            <GridBlock
              align="center"
              contents={[
                {
                  content: '文档还在慢慢完成中',
                  imageAlign: 'top',
                  title: 'Work In Progress',
                },
                {
                  content: '您可以随意发起 Pull Request',
                  imageAlign: 'top',
                  title: '欢迎发 PR',
                },
              ]}
              layout="fourColumn"
            />
          </Container>

          <div
            className="productShowcaseSection paddingBottom"
            style={{textAlign: 'center'}}>
            <h2>鉴于官方的文档相对简陋，我为此作此非官方的插件开发文档。</h2>
            <MarkdownBlock>
              友情提醒：由于 Blessing Skin Server 基于 Laravel 5.2 开发，
              因此在阅读本文档之前，您应该拥有一定的 PHP 基础，如果拥有一定的 Laravel 基础则更佳。
            </MarkdownBlock>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Index;
