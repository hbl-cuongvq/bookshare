import * as React from "react"

import Svg, {
    Defs,
    LinearGradient,
    Stop,
    Path,
    G,
    Ellipse
} from 'react-native-svg'

function BackgroundHome(props) {
    return (
        <Svg width={763} height={1135} viewBox="0 0 763 1135" {...props}>
            <Defs>
                
                {/* <Filter
                    id="prefix__b"
                    x={0}
                    y={29}
                    width={683}
                    height={668}
                    filterUnits="userSpaceOnUse"
                >
                    <FEOffset dy={10} />
                    <FEGaussianBlur stdDeviation={15} result="c" />
                    <FEComposite operator="in" in2="c" />
                    <FEComposite in="SourceGraphic" />
                </Filter>
                <Filter
                    id="prefix__c"
                    x={40}
                    y={0}
                    width={641}
                    height={626}
                    filterUnits="userSpaceOnUse"
                >
                    <FEOffset dy={8} />
                    <FEGaussianBlur stdDeviation={8} result="e" />
                    <FEComposite operator="in" in2="e" />
                    <FEComposite in="SourceGraphic" />
                </Filter> */}
                <LinearGradient
                    id="prefix__a"
                    x1={0.5}
                    x2={0.5}
                    y2={1}
                    gradientUnits="objectBoundingBox"
                >
                    <Stop offset={0} stopColor="#f6bab6" />
                    <Stop offset={0.800} stopColor="#f44336" />
                    <Stop offset={0.900} stopColor="#cc3226" />
                    <Stop offset={1} stopColor="#82160e" />
                </LinearGradient>
            </Defs>
            <Path
                transform="translate(136 259)"
                fill="url(#prefix__a)"
                d="M0 0h627v876H0z"
            />
            <G filter="url(#prefix__b)">
                <Path
                    d="M341.5 64C505.252 64 638 193.39 638 353S505.252 642 341.5 642 45 512.61 45 353 177.748 64 341.5 64z"
                    fill="#ec3e61"
                />
            </G>
            <G filter="url(#prefix__c)">
                <Ellipse
                    cx={296.5}
                    cy={289}
                    rx={296.5}
                    ry={289}
                    transform="translate(64 16)"
                    fill="#fff"
                />
            </G>
        </Svg>
    )
}

export default BackgroundHome