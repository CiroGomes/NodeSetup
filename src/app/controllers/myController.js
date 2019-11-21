import { google } from "googleapis";
// import api from "../../services/gaxiosConfig";
import fs from "fs";

const TOKEN_PATH = "store/token.json";

class MyController {
  async method(req, res) {
    const date = "2019-10-25";

    const auth = req.oAuth2Client;

    const service = google.admin({ version: "reports_v1", auth });

    const params = [
      "accounts:is_2sv_enrolled",
      "drive:num_owned_items_with_visibility_public_delta",
      // "drive:last_active_usage_time",
      "gmail:num_spam_emails_received",
      "gmail:last_interaction_time"
    ];

    service.userUsageReport
      .get({
        userKey: "all",
        date,
        parameters: params.join(",")
      })
      .then(response => res.json(response));
  }
}

export default new MyController();
