import { OutgoingHttpHeaders } from "http";
import passport, { DoneCallback } from "passport";
import {parse} from './profile'
import OAuth2Strategy, {
  InternalOAuthError,
  StrategyOptions,
} from "passport-oauth2";

const GITHUB_CLIENT_ID = "Iv1.d40e80f10f6f9dcf";
const GITHUB_CLIENT_SECRET = "a1f58ae774d51c14ededc6362e33533ad8a3f1aa";

interface IGitStrategy {
  clientID: string;
  clientSecret: string;
  callbackURL: string;

  scope?: string[] | undefined;
  userAgent?: string | undefined;

  authorizationURL?: string | undefined;
  tokenURL?: string | undefined;
  scopeSeparator?: string | undefined;
  customHeaders?: OutgoingHttpHeaders | undefined;
  userProfileURL?: string | undefined;
  userEmailURL?: string | undefined;
  allRawEmails?: boolean | undefined;
}

class GitStrategy extends OAuth2Strategy {
  _userProfileURL: string;
  _userEmailURL: string;
  _allRawEmails: boolean;
  _scope: string[] | (string[] & string) | undefined;
  _scopeSeparator: string;

  constructor(opts: IGitStrategy & StrategyOptions, callback: any) {
    super(opts, callback);
    opts = {} as IGitStrategy & StrategyOptions;
    opts.authorizationURL =
      opts.authorizationURL || "https://github.com/login/oauth/authorize";
    opts.tokenURL =
      opts.tokenURL || "https://github.com/login/oauth/access_token";
    opts.scopeSeparator = opts.scopeSeparator || ",";
    opts.customHeaders = opts.customHeaders || {};

    if (!opts.customHeaders["User-Agent"]) {
      opts.customHeaders["User-Agent"] = opts.userAgent || "passport-github";
    }

    this.name = "github";
    this._oauth2.useAuthorizationHeaderforGET(true);

    this._userProfileURL = opts.userProfileURL || "https://api.github.com/user";
    this._userEmailURL =
      opts.userEmailURL || "https://api.github.com/user/emails";
    this._allRawEmails = opts.allRawEmails || false;
    this._scope = opts.scope;
    this._scopeSeparator = opts.scopeSeparator;
  }

  userProfile(accessToken: string, done: DoneCallback) {
    const self = this;

    this._oauth2.get(this._userProfileURL, accessToken, (err, body, res) => {
      let json;

      if (err) {
        return done(
          new InternalOAuthError("Failed to fetch user profile", err)
        );
      }

      try {
        json = JSON.parse(body as string);
      } catch (ex) {
        return done(new Error("Failed to parse user profile"));
      }

      const profile = parse(json);
      profile.provider = "github";
      profile._raw = body;
      profile._json = json;

      let canAccessEmail = false;
      let scopes = self._scope;

      if (typeof scopes === "string") {
        scopes = scopes.split(self._scopeSeparator);
      }

      if (Array.isArray(scopes)) {
        canAccessEmail = scopes.some(
          (scope) => scope === "user" || scope === "user:email"
        );
      }

      if (!canAccessEmail) {
        return done(null, profile);
      }

      // Getting emails
      self._oauth2.get(self._userEmailURL, accessToken, (err, body, res) => {
        if (err) {
          return done(
            new InternalOAuthError("Failed to fetch user emails", err)
          );
        }

        const json = JSON.parse(body as string);

        if (!json || !json.length) {
          return done(new Error("Failed to fetch user emails"));
        }

        if (self._allRawEmails) {
          profile.emails = json.map((email: any) => {
            email.value = email.email;
            delete email.email;
            return email;
          });
        } else {
          for (const index in json) {
            if (json[index].primary) {
              profile.emails = [{ value: json[index].email }];
              break;
            }
          }
        }

        done(null, profile);
      });
    });
  }
}

passport.use(
  new GitStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:4080/auth/github/callback",
      authorizationURL: "https://github.com/login/oauth/authorize",
      tokenURL: "https://github.com/login/oauth/access_token",
    },
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's GitHub profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the GitHub account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj as Express.User);
});
