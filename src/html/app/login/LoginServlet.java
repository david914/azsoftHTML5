package html.app.login;
import java.io.IOException;
import java.security.PrivateKey;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.ecams.common.base.RSA;
import com.ecams.service.list.LoginManager;
import com.google.gson.*;

import html.app.common.ParsingCommon;

@WebServlet("/webPage/login/Login")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	LoginManager loginManager = LoginManager.getInstance();
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
		doPost(req, resp);
	}
	
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		/*HashMap paramMap = ParsingCommon.reqParamToMap(request); 
		String requestType = (String)paramMap.get("requestType");*/
		
		JsonParser jsonParser = new JsonParser();
		JsonElement jsonElement = jsonParser.parse(ParsingCommon.getJsonStr(request));
		String requestType	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "requestType") );
		
		try {
			response.setContentType("text/plain");
			response.setCharacterEncoding("UTF-8");
			
			switch (requestType) {
				case "ISVALIDLOGIN" :
					response.getWriter().write( isValidLoginUser(jsonElement, request) );
					break;
				case "SETSESSION" :
					response.getWriter().write( getUserName(jsonElement, request)  );
					break;	
				case "UPDATELOGINIP" : 
					updateLoginIp(jsonElement, request);
					break;
				case "removeSession" :
					removeSession(request);
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	private String isValidLoginUser(JsonElement jsonElement, HttpServletRequest request) throws SQLException, Exception {
		String userId  = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userId") );
		String userPwd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userPwd") );
		
		try {
			String decPw = RSA.decryptRsa((PrivateKey) request.getSession().getAttribute("_ecams_encry_key_"), userPwd);//암호화된 비밀번호를 복호화한다.

			if (null == decPw || "".equals(decPw)) {
				return "ENCERROR";
			}
			return gson.toJson(loginManager.isValid(userId, decPw));
		} catch (Exception e) {
			return "ENCERROR["+e.getMessage()+"]";
		}
	}
	
	private String getUserName(JsonElement jsonElement, HttpServletRequest request) throws SQLException, Exception {
		String userId  = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userId") );
		HttpSession session = request.getSession();
		
		session.setAttribute("userId", userId);
		session.setAttribute("userName", loginManager.getUserName(userId));
		loginManager.setSession(session, userId);
		
		return gson.toJson( session.getId() );
	}
	
	private void updateLoginIp(JsonElement jsonElement, HttpServletRequest request) throws SQLException, Exception {
		String userId  = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userId") );
		String IpAddr  = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "IpAddr") );
		String Url	   = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "Url") );
		
		loginManager.updateLoginIp(userId, IpAddr, Url);
	}
	
	private void removeSession(HttpServletRequest request) throws Exception {
		loginManager.removeSession(request.getSession());
	}
}
