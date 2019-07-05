package html.app.winpop;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.eCmr.Cmr0250;
import app.eCmr.Cmr3100;
import app.eCmr.Cmr3200;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/winpop/RequestDetailServlet")
public class RequestDetailServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmr3100 cmr3100 = new Cmr3100();
	Cmr3200 cmr3200 = new Cmr3200();
	Cmr0250 cmr0250  = new Cmr0250();
	
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
				case "getReqList" :
					response.getWriter().write( getReqList(jsonElement) );
					break;
				case "getPrcSys" :
					response.getWriter().write( getPrcSys(jsonElement) );
					break;
				case "getProgList" :
					response.getWriter().write( getProgList(jsonElement) );
					break;
				case "getRstList" :
					response.getWriter().write( getRstList(jsonElement) );
					break;
				case "gyulChk" :
					response.getWriter().write( gyulChk(jsonElement) );
					break;
				case "updtDeploy_2" :
					response.getWriter().write( updtDeploy_2(jsonElement) );
					break;
				case "updtTemp" :
					response.getWriter().write( updtTemp(jsonElement) );
					break;
				case "reqCncl" :
					response.getWriter().write( reqCncl(jsonElement) );
					break;
				case "progCncl_sel" :
					response.getWriter().write( progCncl_sel(jsonElement) );
					break;
				case "progCncl" :
					response.getWriter().write( progCncl(jsonElement) );
					break;
				case "updtSeq" :
					response.getWriter().write( updtSeq(jsonElement) );
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

	private String getReqList(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		
		return gson.toJson(cmr0250.getReqList(UserId,AcptNo));
	}

	private String getPrcSys(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		
		return gson.toJson(cmr0250.getPrcSys(AcptNo));
	}

	private String getProgList(JsonElement jsonElement) throws SQLException, Exception {
		
		HashMap<String, String> param = new HashMap<String, String>();
		param = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"param"));
		
		return gson.toJson(cmr0250.getProgList(param.get("UserId"),param.get("AcptNo"),param.get("chkYn"),Boolean.parseBoolean(param.get("qrySw"))));
	}
	
	private String getRstList(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String prcSys = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "prcSys") );
		
		return gson.toJson(cmr0250.getRstList(UserId,AcptNo,prcSys));
	}
	
	private String gyulChk(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		
		return gson.toJson(cmr3100.gyulChk(AcptNo, UserId));
	}
	
	private String updtDeploy_2(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String CD = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "priorityCD") );
		
		return gson.toJson(cmr0250.updtDeploy_2(AcptNo, CD));
	}
	
	private String updtTemp(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String ItemId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ItemId") );

		return gson.toJson(cmr0250.updtTemp(AcptNo, ItemId));
	}
	
	private String reqCncl(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String ConMsg = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "conMsg") );
		String ConfUsr = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ConfUsr") );
		
		try { 
			return gson.toJson(cmr3200.reqCncl(AcptNo, UserId, ConMsg, ConfUsr));
		} catch (SQLException e) {
			return gson.toJson(e.getMessage());
		} catch (Exception e) {
			return gson.toJson(e.getMessage());
		} 
	}
	
	private String progCncl_sel(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		ArrayList<HashMap<String, String>> fileList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "fileList") );
		String PrcSys = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "PrcSys") );
		
		try { 
			return gson.toJson(cmr0250.progCncl_sel(AcptNo, fileList, PrcSys));
		} catch (SQLException e) {
			return gson.toJson(e.getMessage());
		} catch (Exception e) {
			return gson.toJson(e.getMessage());
		} 
	}
	
	private String progCncl(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String ItemId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ItemId") );
		String PrcSys = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "PrcSys") );
		
		try { 
			return gson.toJson(cmr0250.progCncl(AcptNo, ItemId, PrcSys));
		} catch (SQLException e) {
			return gson.toJson(e.getMessage());
		} catch (Exception e) {
			return gson.toJson(e.getMessage());
		} 
	}
	
	private String updtSeq(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		ArrayList<HashMap<String, String>> fileList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "fileList") );

		return gson.toJson(cmr0250.updtSeq(AcptNo, fileList));
	}
}
