/** @jsx jsx */
import { React, AllWidgetProps, jsx, css, type SerializedStyles } from 'jimu-core'
import { type IMConfig } from './config'

interface WidgetState {
  iconSize: number | null
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, WidgetState> {
  private readonly containerRef = React.createRef<HTMLDivElement>()

  private resizeObserver?: ResizeObserver

  private readonly handleWindowResize = (): void => {
    this.updateIconSize()
  }

  state: WidgetState = {
    iconSize: null
  }

  componentDidMount(): void {
    this.initializeResizeObserver()
    this.updateIconSize()
  }

  componentDidUpdate(prevProps: Readonly<AllWidgetProps<IMConfig>>): void {
    if (prevProps.config !== this.props.config) {
      this.updateIconSize()
    }
  }

  componentWillUnmount(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    } else if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleWindowResize)
    }
  }

  initializeResizeObserver = (): void => {
    const container = this.containerRef.current

    if (!container || typeof window === 'undefined') {
      return
    }

    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateIconSize()
      })
      this.resizeObserver.observe(container)
    } else {
      window.addEventListener('resize', this.handleWindowResize)
    }
  }

  updateIconSize = (): void => {
    const container = this.containerRef.current

    if (!container) {
      return
    }

    const width = container.clientWidth
    const height = container.clientHeight

    if (width === 0 && height === 0) {
      return
    }

    const { config } = this.props
    const padding = config.padding ?? 0
    const availableSize = Math.max(Math.min(width, height) - padding * 2, 0)

    const configuredSizes = [config.iconWidth, config.iconHeight].filter((value): value is number => typeof value === 'number')
    const desiredSize = configuredSizes.length > 0 ? Math.min(...configuredSizes) : undefined

    const nextSize = desiredSize != null ? Math.min(availableSize, desiredSize) : availableSize

    if (this.state.iconSize !== nextSize) {
      this.setState({ iconSize: nextSize })
    }
  }

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
        width: 100%;
        height: 100%;
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
    const configuredSizes = [config.iconWidth, config.iconHeight].filter((value): value is number => typeof value === 'number')
    const fallbackSize = configuredSizes.length > 0 ? Math.min(...configuredSizes) : 50
    const iconDimension = this.state.iconSize ?? fallbackSize

    return (
      <div
        className={`svg-icon-widget widget-${id}`}
        css={this.getStyle()}
        title="Custom SVG Icon"
        ref={this.containerRef}
      >
        <div
          className="icon-box"
          style={{ width: iconDimension, height: iconDimension }}
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </div>
    )
  }
}
