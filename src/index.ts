import server from "./server";
import colors from "colors";

const port = process.env.PORT || 4000;

server.listen(port, () => {
  //TODO: COLORS USAGE
  console.log(colors.cyan.bold(`REST API FUNCIONANDO EN PUERTO ${port}`));
});
