import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Spline from '@splinetool/react-spline';

export default function CustomHeader() {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#1a1a1a", boxShadow: 4 }}>
    <Container maxWidth="xl" sx={{ width: '100%', boxSizing: 'border-box', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px',marginLeft:'auto' }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
            GOLDFIT&DIET
          </Typography>
          <Box sx={{ display: "flex", gap: 4 }}>
            {[' GOLDFIT&DIET', 'Wourkouts', 'Our Vision'].map((item) => (
              <Link
                href="#"
                key={item}
                underline="hover"
                sx={{
                  color: "#f1f1f1",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  transition: "color 0.3s ease",
                  '&:hover': {
                    color: "#ffcc00",
                  },
                }}
              >
                {item}
              </Link>
            ))}
          </Box>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "50px",
              color: "#ffcc00",
              borderColor: "#ffcc00",
              padding: "8px 20px",
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.05em",
              '&:hover': {
                backgroundColor: "#ffcc00",
                color: "black",
              },
            }}
          >
            Try Now
          </Button>
        </Toolbar>
        <Divider sx={{ backgroundColor: "#333" }} />

      </Container>
    </AppBar>
  );
}
