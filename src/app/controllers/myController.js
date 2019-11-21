import { google } from "googleapis";
// import api from "../../services/gaxiosConfig";
import fs from "fs";

const TOKEN_PATH = "store/token.json";

class MyController {
  async method(req, res) {
    const data = "2019-11-01";

    const auth = req.oAuth2Client;


    const service = google.admin({ version: "reports_v1", auth });
    service.activities.list(
      {
        userKey: "all",
        applicationName: "login",
        maxResults: 10
      },
      (err, resReports) => {
        if (err)
          return console.error("The API returned an error:", err.message);

        const activities = resReports.data.items;
        if (activities.length) {
          console.log("Logins:");
          res.send(activities);
          activities.forEach(activity => {
            console.log(
              `${activity.id.time}: ${activity.actor.email} (${activity.events[0].name})`
            );
          });
        } else {
          console.log("No logins found.");
        }
      }
    );
  }
}

export default new MyController();
