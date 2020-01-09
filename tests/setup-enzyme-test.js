import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// process.on("unhandledRejection", (reason, p) => {
// // console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
//   // application specific logging, throwing an error, or other logic here
// });

configure({ adapter: new Adapter() });