import {extendTheme} from "@chakra-ui/react"
import {mode} from "@chakra-ui/theme-tools"
const theme = extendTheme({
    colors: {
      brand: {
        50 : "#b3b3b3",
        100: "#ffffff",
        200: "#f3f3f3",
        300: "#CBD5E0",
        400: "#F6E05E",
        500: "#FE6F04",
        600: "#A3D50D",
        700: "#F6AD55",
        800: "#FE6F04",
        900: "#1a202c",
        1000: "#212F3C",
        2000 : "#000000"
      },
    },
    styles:{
        global: (props) => ({
            body:{
                bg: props.colorMode=="light" ? "brand.200": "brand.1000",
                colorScheme: "brand",
                color : props.colorMode=="light" ? "brand.900": "brand.100"
            },
        })
    },
    components:{
      Button:{
        baseStyle:{
          fontFamily: "sans-serif",
          fontWeight: "bold",
          fontSize : "1em"
        },
        sizes:{
         
        },
        variants:{
          "navlink":{
            bg:"transparent",
            _focus:{outline:"0px"},
          },
          "avatar":{
            _hover: { background: "transparent" },
            _active:{background: "transparent", opacity: 0.7},
            background: "transparent",
            colorScheme: "brand",
            outline: "2px"
          }

        },
        defaultProps:{
            variant : "avatar",
            size : "md",
        }
      },
      NavBar: {
          baseStyle:(props) => ({
            bg : mode("brand.300", "brand.2000")(props),
            color : mode("brand.900", "brand.300")(props),
        }),
        
      }
    }
  })

  export default theme;