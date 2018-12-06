import * as React from 'react'

interface IProps {
  children?: any
  pageTitle: string
}
export default class HeadWrapper extends React.Component<IProps> {
  public componentDidMount() {
    document.title = this.props.pageTitle
  }
  public render() {
    return this.props.children
  }
}