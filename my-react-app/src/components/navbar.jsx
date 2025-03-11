import Box from "@mui/material/Box";
import Spline from '@splinetool/react-spline';

export default function NavBar() {
  return (
    <Box 
      sx={{
        position: 'relative',
        height:'45vw' ,
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
      }}
    >
      <Spline
      // scene="https://prod.spline.design/lvKHRIond7TKjDk9/scene.splinecode"
      //https://prod.spline.design/3BA7i1My9MXsu71T/scene.splinecode
        scene="https://prod.spline.design/T1tZP4lWDfSJgJcJ/scene.splinecode"
        style={{ width: '100%', height: '100%', maxWidth: '100vw'
        }}
      />
    </Box>
  );
}
