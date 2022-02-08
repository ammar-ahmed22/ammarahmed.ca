import React, { useEffect, useState } from 'react';
import { Box } from "@chakra-ui/react"
import '../assets/css/Signature.css'

const Signature = ({ color }) => {
    const styleProps = {
        box: {
            position: "absolute",
            transform: "translate(-70%, 0)",
            top: '20%',
            left: "30%",
            zIndex: -1,
        }
    }

    
    
    return (
        <Box {...styleProps.box} >
            <svg width="602" height="328" viewBox="0 0 602 328" fill="none" xmlns="http://www.w3.org/2000/svg" className='signature'>
            <path d="M2.901 211.611C-0.436211 218.284 1.59646 226.509 1.78308 233.969C2.38879 258.202 2.6456 286.757 10.7264 309.989C12.5912 315.35 14.7631 320.632 17.4342 325.64C17.8263 326.376 18.9008 327.079 19.67 326.758C23.6815 325.088 28.3235 323.586 30.8494 320.051C44.2854 301.24 49.0284 277.418 55.4441 255.211C61.2137 235.239 65.6543 214.905 71.0954 194.841C87.5882 134.022 105.297 73.8129 120.284 12.6174C121.21 8.83854 123.209 5.30475 123.638 1.43798C123.843 -0.413856 120.697 4.09272 120.284 5.90966C118.681 12.9653 116.415 19.94 115.812 27.1506C114.544 42.3808 114.237 57.7099 114.696 72.9861C116.821 143.898 131.163 211.579 153.822 278.686C156.922 287.868 160.296 297.049 165.001 305.517C166.058 307.417 169.055 310.407 170.592 308.872C172.699 306.763 170.592 302.909 170.592 299.928" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.8354 178.025C27.3434 178.025 33.2201 173.674 38.7226 170.199C48.2477 164.182 57.346 157.515 66.671 151.194C89.3085 135.846 110.768 121.099 133.748 106.476C140.38 102.255 147.061 98.1066 153.87 94.1784C156.757 92.5128 159.56 88.9836 162.814 89.7066C166.536 90.5336 163.396 97.9254 162.814 99.768C160.934 105.725 158.78 111.605 157.223 117.655C155.423 124.663 153.531 131.702 152.753 138.896C151.744 148.225 148.7 161.083 156.107 166.843C164.295 173.214 172.292 149.005 173.993 145.604C179.942 133.704 189.588 102.032 203.061 95.2964C204.261 94.6954 205.118 97.3183 205.296 98.6501C205.886 103.083 205.615 107.605 205.296 112.065C204.867 118.059 203.701 123.978 203.061 129.953C202.383 136.262 198.421 143.678 201.942 148.957C202.803 150.251 206.336 142.543 209.768 136.66C210.444 135.499 211.355 134.484 212.003 133.306C222.331 114.529 232.866 90.1945 251.131 77.4092C253.268 75.9135 257.728 75.1076 258.957 77.4092C261.592 82.3523 260.075 88.5763 260.075 94.1784C260.075 101.268 259.373 108.341 258.957 115.419C258.628 121.012 258.105 126.593 257.838 132.188C257.732 134.422 256.257 137.315 257.838 138.896C259.607 140.664 260.294 134.521 261.192 132.188C262.759 128.117 263.987 123.917 265.664 119.891C268.876 112.184 279.441 84.9252 289.141 84.117C298.366 83.3482 295.832 111.966 296.966 118.773C298.659 128.932 299.841 131.603 301.438 131.07C309.671 128.326 314.96 107.632 318.208 102.004C321.151 96.9004 324.538 92.0309 328.269 87.4707C332.171 82.701 341.067 71.8707 343.92 78.5272C347.88 87.7674 339.905 120.596 349.511 126.599C356.999 131.279 367.13 113.113 369.632 109.83C375.813 101.717 387.457 78.5635 395.346 74.0555C396.261 73.5325 397.392 75.2544 397.581 76.2913C398.381 80.691 396.644 85.3342 397.581 89.7066C399.376 98.0781 400.163 106.429 409.879 109.83C422.228 114.152 430.375 106.232 438.944 98.6501C448.088 90.5623 454.869 79.1592 457.949 67.3478C458.709 64.4408 460.095 61.2278 459.068 58.4044C458.326 56.3623 455.579 54.4906 453.477 55.0504C449.083 56.2226 445.179 59.3556 442.298 62.8761C438.286 67.779 435.778 73.7915 433.356 79.6451C431.28 84.6587 429.354 89.891 428.884 95.2964C428.587 98.7191 428.577 103.047 431.119 105.358C433.617 107.628 438.131 107.92 441.181 106.476C445.943 104.22 449.171 99.4921 452.361 95.2964C456.304 90.1063 458.908 84.0177 462.421 78.5272C464.559 75.1878 472.982 59.8312 478.073 57.2865C478.818 56.9138 479.191 58.6889 479.191 59.5223C479.191 61.7891 478.649 64.0379 478.073 66.2298C476.783 71.1316 474.831 75.8459 473.601 80.7632C472.065 86.9081 467.862 103.751 471.366 106.476C478.005 111.64 489.657 96.6779 498.196 88.5887C526.5 61.7739 553.621 35.7216 588.748 18.1584" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M172.829 151.278C175.255 156.131 176.549 161.554 177.301 166.928C179.275 181.03 180.383 195.239 181.773 209.409C184.215 234.328 185.18 259.37 187.363 284.312C188.213 294.028 189.427 303.712 190.717 313.378C190.92 314.901 190.982 316.572 191.834 317.85C193.297 320.043 194.948 324.34 197.424 323.44C201.212 322.063 202.598 317.106 204.131 313.378C207.856 304.334 210.186 294.776 213.075 285.431C216.523 274.28 219.623 263.023 223.136 251.891C226.33 241.779 228.81 231.363 233.199 221.707C236.321 214.838 239.332 207.055 245.497 202.702C247.873 201.023 251.283 205.531 252.204 208.293C254.82 216.142 254.387 224.696 255.557 232.886C258.53 253.696 259.469 273.412 262.264 294.373C263.116 300.751 262.609 307.694 265.618 313.378C266.665 315.356 270.746 314.959 272.327 313.378C277.662 308.042 281.064 301.026 284.623 294.373C294.849 275.256 302.649 254.936 311.453 235.123C314.436 228.416 317.241 221.627 320.397 215C320.906 213.931 325.627 206.239 328.223 209.409C331.433 213.333 331.957 218.93 332.695 223.944C334.928 239.131 334.573 254.649 337.167 269.78C338.13 275.398 334.956 285.311 340.521 286.547C347.288 288.053 352.96 279.663 357.289 274.252C360.75 269.925 361.083 263.84 362.879 258.6C365.555 250.797 368.278 243.007 370.705 235.123C372.752 228.47 374.537 221.737 376.295 215C376.774 213.162 376.068 208.068 377.412 209.409C378.401 210.398 378.722 219.303 378.53 221.707C377.904 229.543 376.678 237.332 376.295 245.184C375.815 255 375.972 278.915 378.53 288.784C379.412 292.188 380.646 297.192 384.119 297.727C387.804 298.295 390.75 293.942 393.063 291.019C397.942 284.857 401.682 277.844 405.361 270.896C412.945 256.569 416.945 241.767 421.012 226.179C421.491 224.341 421.818 222.465 422.131 220.591C422.563 217.991 422.874 210.155 423.247 212.765C425.357 227.525 420.941 242.618 422.131 257.482C422.859 266.587 423.445 276.237 427.719 284.312C430.578 289.713 436.143 295.683 442.252 295.491C450.431 295.236 457.911 289.175 463.494 283.194C473.932 272.013 481.723 258.525 489.206 245.184C498.91 227.886 507.106 209.754 514.918 191.523C533.054 149.209 540.309 117.725 546.221 71.9038C546.841 67.0991 546.651 62.1958 546.221 57.3706C544.787 41.3026 546.942 24.1456 540.632 9.29903C538.83 5.05703 529.951 8.94213 527.216 12.653C518.71 24.1981 513.289 37.9977 509.329 51.7808C503.898 70.6816 500.714 90.3013 499.269 109.914C497.349 135.928 495.154 162.41 499.269 188.17C503.823 216.685 512.555 244.829 524.981 270.896C531.919 285.455 542.785 298.963 556.283 307.789C563.774 312.688 574.54 311.48 583.114 308.908C590.471 306.699 595.039 299.218 601 294.373" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </Box>
        
    );
}

export default Signature;
