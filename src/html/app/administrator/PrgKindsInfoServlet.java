package html.app.administrator;

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

import app.eCmm.Cmm0100;
import app.eCmm.Cmm0200_Copy;
import app.eCmm.Cmm0200_Prog;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/PrgKindsServlet")
public class PrgKindsInfoServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmm0100 cmm0100 = new Cmm0100();
	Cmm0200_Copy cmm0200_copy = new Cmm0200_Copy();
	Cmm0200_Prog cmm0200_prog = new Cmm0200_Prog();
	
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
				case "getProgInfoTree" :
					response.getWriter().write(getProgInfoTree(jsonElement));
					break;
				case "getSameCbo" :
					response.getWriter().write(getSameCbo(jsonElement));
					break;
				case "getSameList" :
					response.getWriter().write(getSameList(jsonElement));
					break;
				case "getProgList" :
					response.getWriter().write(getProgList(jsonElement));
					break;
				case "getProcInfoInit" :
					response.getWriter().write(getProcInfoInit(jsonElement));
					break;
				case "setPrgSeq" :
					response.getWriter().write(setPrgSeq(jsonElement));
					break;
				case "closePrgInfo" :
					response.getWriter().write(closePrgInfo(jsonElement));
					break;
				case "insertPrgInfo" :
					response.getWriter().write(insertPrgInfo(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [시스템정보 > 프로그램종류정보]  처리속성 트리 가져오기
	private String getProgInfoTree(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0100.getProgInfoZTree());
	}
	
	// [시스템정보 > 프로그램종류정보]  동시적용프로그램종류가져오기
	private String getSameCbo(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		return gson.toJson(cmm0200_copy.getProgInfo(SysCd));
	}
	
	// [시스템정보 > 프로그램종류정보]  동시적용프로그램 리스트 가져오기
	private String getSameList(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		return gson.toJson(cmm0200_prog.getSameList(SysCd));
	}
	
	// [시스템정보 > 프로그램종류정보]  프로그램 리스트 가져오기
	private String getProgList(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		return gson.toJson(cmm0200_prog.getProgList(SysCd));
	}
	
	// [시스템정보 > 프로그램종류정보]  처리팩터수가져오기
	private String getProcInfoInit(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0100.getProcInfo_Init());
	}
	
	// [시스템정보 > 프로그램종류정보] 프로그램종류 우선순위 세팅
	private String setPrgSeq(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String SecuCd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "SecuCd") );
		return gson.toJson(cmm0200_prog.rsrcInfo_seq(SysCd, SecuCd));
	}
	
	// [시스템정보 > 프로그램종류정보] 프로그램 종류 폐기
	private String closePrgInfo(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String UserId = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String RsrcCd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "RsrcCd") );
		return gson.toJson(cmm0200_prog.rsrcInfo_Close(SysCd, UserId, RsrcCd));
	}
	
	// [시스템정보 > 프로그램종류정보] 프로그램 종류 폐기
	private String insertPrgInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> etcData 			= ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "etcData") );
		ArrayList<HashMap<String, String>> sameList = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement, "sameList") );
		return gson.toJson(cmm0200_prog.rsrcInfo_Ins(etcData, sameList));
	}
}
