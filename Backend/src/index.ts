import app from "./app";
import { PORT } from "./utils/config";

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
