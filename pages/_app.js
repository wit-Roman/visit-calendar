import App, { Container } from 'next/app'
import withReduxStore from './with-redux-store'
import { Provider } from 'react-redux'
import Head from 'next/head'
import '../stylesheets/calendar.scss'

class MyApp extends App {
  render () {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <div>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="author" content="@2wit1" />
          <title>Календарь посещений</title>
          <meta name="description" content="Календарь посещений - приложение для вк сообщества, позволяющее записаться в один клик и оценить количество посещений в конкретную дату" />
          <meta name="keywords" content="календарь посещений приложения сообщества вк" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="icon" type="image/x-icon" href="/static/img/favicon.ico" />

          <meta property="og:url" content="https://vk.apps-web.xyz/welcome/" />
          <meta property="og:title" content="Календарь посещений" />
          <meta property="og:site_name" content="Календарь посещений" />
          <meta property="og:description" content="Календарь посещений - приложение для вк сообщества, позволяющее записаться в один клик и оценить количество посещений в конкретную дату" />
          <meta property="og:image" content="https://vkapp.apps-web.xyz/static/img/278x278.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="278" />
          <meta property="og:image:height" content="278" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content="@2wit1" />
          <meta name="twitter:image:alt" content="Календарь посещений - приложение для вк сообщества, позволяющее записаться в один клик и оценить количество посещений в конкретную дату" />
          <meta name="twitter:title" content="Календарь посещений" />
          <meta name="twitter:description" content="Календарь посещений - приложение для вк сообщества, позволяющее записаться в один клик и оценить количество посещений в конкретную дату" />
          <meta name="twitter:image" content="https://vkapp.apps-web.xyz/static/img/278x278.png" />
        </Head>
        <Container>
          <Provider store={reduxStore}>
            <Component {...pageProps} />
          </Provider>
        </Container>
      </div>
    )
  }
}

export default withReduxStore(MyApp)