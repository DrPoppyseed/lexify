use rocket::{
    fairing::{Fairing, Info, Kind},
    http::Header,
    Request,
    Response,
};
use rocket_sync_db_pools::database;

#[database("mysql_db")]
pub struct DbConn(diesel::MysqlConnection);

pub struct Cors;

#[rocket::async_trait]
impl Fairing for Cors {
    fn info(&self) -> Info {
        Info {
            name: "Cross-Origin-Resource-Sharing Middleware",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(
        &self,
        _request: &'r Request<'_>,
        response: &mut Response<'r>,
    ) {
        response.set_header(Header::new("access-control-allow-origin", "*"));
        response.set_header(Header::new(
            "access-control-allow-headers",
            "Origin, Content-Type, X-Auth-Token, authorization, accept",
        ));
        response.set_header(Header::new(
            "access-control-allow-methods",
            "GET, PATCH, OPTIONS, POST, PUT, DELETE",
        ));
    }
}
