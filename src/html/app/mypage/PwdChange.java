package html.app.mypage;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.ecams.service.member.dao.MemberDAO;
import com.ecams.service.passwd.dao.PassWdDAO;

import html.app.common.ParsingCommon;

@WebServlet("/webPage/mypage/PwdChange")
public class PwdChange extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	MemberDAO memberdao = new MemberDAO();
	PassWdDAO passwddao = new PassWdDAO();
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
		doPost(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonParser jsonParser = new JsonParser();
		JsonElement jsonElement = jsonParser.parse(ParsingCommon.getJsonStr(request));
		String requestType	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "requestType") );
		
		try {
			response.setContentType("text/plain");
			response.setCharacterEncoding("UTF-8");
			
			switch (requestType) {
				case "getUserName" :
					response.getWriter().write(getUserName(jsonElement));
					break;
				case "getPasswdBef":
					response.getWriter().write( selectPassWd(jsonElement) );
					break;
				case "encryptPassWd":
					response.getWriter().write( encryptPassWd(jsonElement) );
					break;
				case "getLastPasswdBef":
					response.getWriter().write( selectLastPassWord(jsonElement) );
					break;
				case "setPassWd":
					response.getWriter().write( updtPassWd(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			requestType = null;
		}
	}
	
	// [비밀번호 초기화] 사용자이름가져오기
	private String getUserName(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(memberdao.selectUserName(UserId));
	}
	// [비밀번호 초기화] 이전 비밀번호 가져오기 
	private String selectPassWd(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(passwddao.selectPassWd(UserId));
	}
	// [비밀번호 초기화] 
	private String encryptPassWd(JsonElement jsonElement) throws SQLException, Exception {
		String usr_passwd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "usr_passwd") );
		return gson.toJson(passwddao.encryptPassWd(usr_passwd));
	}
	// [비밀번호 초기화] 
	private String selectLastPassWord(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(passwddao.selectLastPassWord(UserId));
	}
	// [비밀번호 초기화] 
	private String updtPassWd(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String usr_passwd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "usr_passwd") );
		return gson.toJson(passwddao.updtPassWd(UserId,usr_passwd));
	}
}
