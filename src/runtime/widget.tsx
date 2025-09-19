/** @jsx jsx */
import { React, AllWidgetProps, jsx, css, type SerializedStyles } from 'jimu-core'
import { type IMConfig } from './config'

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, unknown> {
  getAlignmentStyles = (alignment: string): { justifyContent: string, alignItems: string } => {
    if (!alignment || alignment === 'center') {
      return { justifyContent: 'center', alignItems: 'center' }
    }
    const [vertical, horizontal] = alignment.split('-')
    const justifyContentMap: { [key: string]: string } = { left: 'flex-start', center: 'center', right: 'flex-end' }
    const alignItemsMap: { [key: string]: string } = { top: 'flex-start', center: 'center', bottom: 'flex-end' }
    return {
      justifyContent: justifyContentMap[horizontal] ?? 'center',
      alignItems: alignItemsMap[vertical] ?? 'center'
    }
  }

  getStyle = (): SerializedStyles => {
    const { config } = this.props
    const iconAlignment = config.iconAlignment ?? 'center'
    const { justifyContent, alignItems } = this.getAlignmentStyles(iconAlignment)

    return css`
      & {
        width: 100%;
        height: 100%;
        margin: ${config.margin ?? 0}px;
        overflow: hidden;

        display: flex;
        align-items: ${alignItems};
        justify-content: ${justifyContent};
      }
      
      .icon-box {
        width: ${config.iconWidth ?? 50}px;
        height: ${config.iconHeight ?? 50}px;
        background-color: ${config.backgroundColor ?? 'transparent'};
        padding: ${config.padding ?? 0}px;
        border-radius: ${config.borderRadius ?? 0}px;
        
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 100%;
        max-height: 100%;
      }

      .icon-box svg {
        max-width: 100%;
        max-height: 100%;
        display: block;
        fill: ${config.iconColor ?? '#000000'};
        stroke: ${config.strokeColor ?? 'none'};
        stroke-width: ${config.strokeWidth ?? 0}px;
      }
    `
  }

  render(): React.ReactElement {
    const { config, id } = this.props
    const svgCode = config.svgCode ?? '<svg viewBox="0 0 16 16"></svg>'
    return (
      <div
        className={`svg-icon-widget widget-${id}`}
        css={this.getStyle()}
        title="Custom SVG Icon"
      >
        <div
          className="icon-box"
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </div>
    )
  }
}