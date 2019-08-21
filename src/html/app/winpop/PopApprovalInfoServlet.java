package html.app.winpop;

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

import app.common.TimeSch;
import app.eCmr.Cmr6000;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/winpop/PopApprovalInfo")
public class PopApprovalInfoServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	
	Gson gson = new Gson();
	Cmr6000 cmr6000 = new Cmr6000();
	TimeSch timeSch = new TimeSch();
	
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
				case "selectConfirm" :
					response.getWriter().write( selectConfirm(jsonElement) );
					break;
				case "selectLocat" :
					response.getWriter().write( selectLocat(jsonElement) );
					break;
				case "selectTimeSch" :
					response.getWriter().write( selectTimeSch(jsonElement) );
					break;
				case "selectUser" :
					response.getWriter().write( selectUser(jsonElement) );
					break;
				case "updateConfirm" :
					response.getWriter().write( updateConfirm(jsonElement) );
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
	
	// [공통 > 결재정보] 결재정보 리스트 가져오기
	private String selectConfirm(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		return gson.toJson(cmr6000.selectConfirm(AcptNo));
	}
	
	// [공통 > 결재정보] 현재상황 가져오기
	private String selectLocat(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		return gson.toJson(cmr6000.selectLocat(UserId, AcptNo));
	}
	
	// [공통 > 결재정보] 현재상황 가져오기
	private String selectTimeSch(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(timeSch.SelectTimeSch());
	}
	
	// [공통 > 결재정보] 대결재자 정보 가져오기 완료
	private String selectUser(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String BaseUser = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "BaseUser") );
		return gson.toJson(cmr6000.selectDaegyul(UserId, BaseUser));
	}
	
	// [공통 > 결재정보] 대결재자 정보 가져오기 완료
	private String updateConfirm(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String Locat 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "Locat") );
		String BlankCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "BlankCd") );
		String SayuCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SayuCd") );
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String DaeUser 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "DaeUser") );
		return gson.toJson(cmr6000.updtConfirm(AcptNo, Locat, BlankCd, SayuCd, UserId, DaeUser));
	}
}
