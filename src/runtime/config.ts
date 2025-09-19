import { type ImmutableObject } from 'jimu-core'

export type IMConfig = ImmutableObject<{
    svgCode: string
    iconColor: string
    backgroundColor: string
    strokeColor: string
    strokeWidth: number
    iconWidth: number
    iconHeight: number
    padding: number
    margin: number
    borderRadius: number
    iconAlignment: string
}>