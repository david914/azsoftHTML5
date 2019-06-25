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

import com.ecams.service.list.LoginManager;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.eCmm.Cmm0700;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/Configuration")
public class Configuration extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmm0700 cmm0700 = new Cmm0700();
	
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
				case "getAgentInfo" :
					response.getWriter().write( getAgentInfo(jsonElement) );
					break;
				case "setAgentInfo" :
					response.getWriter().write( setAgentInfo(jsonElement) );
					break;
				case "getOperTimeList" :
					response.getWriter().write( getOperTimeList(jsonElement) );
					break;
				case "deleteOperList" :
					response.getWriter().write( deleteOperList(jsonElement) );
					break;
				case "insertOperTime" :
					response.getWriter().write( insertOperTime(jsonElement) );
					break;
				case "getDelCycleList" :
					response.getWriter().write( getDelCycleList(jsonElement) );
					break;
				case "deleteDelCycle" :
					response.getWriter().write( deleteDelCycle(jsonElement) );
					break;
				case "insertDelCycle" :
					response.getWriter().write( insertDelCycle(jsonElement) );
					break;
				case "getDirList" :
					response.getWriter().write( getDirList(jsonElement) );
					break;
				case "insertDirList" :
					response.getWriter().write( insertDirList(jsonElement) );
					break;
				case "deleteDirList" :
					response.getWriter().write( deleteDirList(jsonElement) );
					break;
				case "getWorkServerList" :
					response.getWriter().write( getWorkServerList(jsonElement) );
					break;
				case "insertWorkServerList" :
					response.getWriter().write( insertWorkServerList(jsonElement) );
					break;
				case "delWorkServerList" :
					response.getWriter().write( delWorkServerList(jsonElement) );
					break;
				case "getNotiList" :
					response.getWriter().write( getNotiList(jsonElement) );
					break;
				case "getNotiInfo" :
					response.getWriter().write( getNotiInfo(jsonElement) );
					break;
				case "insertNotiInfo" :
					response.getWriter().write( insertNotiInfo(jsonElement) );
					break;
				case "insertNotiList" :
					response.getWriter().write( insertNotiList(jsonElement) );
					break;
				case "delNotiList" :
					response.getWriter().write( delNotiList(jsonElement) );
					break;
				case "getSrCatType" :
					response.getWriter().write( getSrCatType(jsonElement) );
					break;
				case "setSrCatType" :
					response.getWriter().write( setSrCatType(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [ȯ�漳��] ȯ�漳�� �⺻���� ��������
	private String getAgentInfo(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0700.getAgentInfo());
	}
	
	// [ȯ�漳��] ȯ�漳�� �⺻���� ��������
	private String setAgentInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> objData = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "objData") );
		return gson.toJson(cmm0700.setAgentInfo(objData));
	}
	
	
	// [ȯ�漳�� > ��ð�����] ��ð����� ����Ʈ ��������
	private String getOperTimeList(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0700.getTab1Info());
	}
	
	// [ȯ�漳�� > ��ð�����] ��ð����� ����Ʈ ����
	private String deleteOperList(JsonElement jsonElement) throws SQLException, Exception {
		String timegb = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "timegb") );
		return gson.toJson(cmm0700.delTab1Info(timegb));
	}
	// [ȯ�漳�� > ��ð�����] ��ð����� ����Ʈ ���
	private String insertOperTime(JsonElement jsonElement) throws SQLException, Exception {
		String timegb = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "timegb") );
		String stTime = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "stTime") );
		String edTime = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "edTime") );
		return gson.toJson(cmm0700.addTab1Info(timegb, stTime, edTime));
	}
	
	
	// [ȯ�漳�� > �����ð�����] �����ð����� ����Ʈ ��������
	private String getDelCycleList(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0700.getTab2Info());
	}
	// [ȯ�漳�� > �����ð�����] �����ð����� ����Ʈ ��������
	private String deleteDelCycle(JsonElement jsonElement) throws SQLException, Exception {
		String delgb = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "delgb") );
		return gson.toJson(cmm0700.delTab2Info(delgb));
	}
	// [ȯ�漳�� > �����ð�����] �����ð����� ����Ʈ ��������
	private String insertDelCycle(JsonElement jsonElement) throws SQLException, Exception {
		String delgb 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "delgb") );
		String deljugi 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "deljugi") );
		String jugigb 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "jugigb") );
		return gson.toJson(cmm0700.addTab2Info(delgb, deljugi, jugigb));
	}
	
	// [ȯ�漳�� > ���丮��å] ���丮��å ����Ʈ ��������
	private String getDirList(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0700.getTab3Info());
	}
	// [ȯ�漳�� > ���丮��å] ���丮��å ���
	private String insertDirList(JsonElement jsonElement) throws SQLException, Exception {
		String pathcd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pathcd") );
		String path 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "path") );
		String tip 		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "tip") );
		String tport 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "tport") );
		return gson.toJson(cmm0700.addTab3Info(pathcd, path, tip, tport));
	}
	// [ȯ�漳�� > ���丮��å] ���丮��å ���
	private String deleteDirList(JsonElement jsonElement) throws SQLException, Exception {
		String pathcd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pathcd") );
		return gson.toJson(cmm0700.delTab3Info(pathcd));
	}
	
	// [ȯ�漳�� > �۾���������] �۾��������� ����Ʈ ��������
	private String getWorkServerList(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0700.getTab4Info());
	}
	// [ȯ�漳�� > �۾���������] �۾��������� ����Ʈ ���
	private String insertWorkServerList(JsonElement jsonElement) throws SQLException, Exception {
		String jobgb 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "jobgb") );
		String tip 		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "tip") );
		String tport 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "tport") );
		String tuserid 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "tuserid") );
		String tpwd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "tpwd") );
		String texename = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "texename") );
		String tagent 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "tagent") );
		String stopsw 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "stopsw") );
		return gson.toJson(cmm0700.addTab4Info(jobgb, tip, tport, tuserid, tpwd, texename, tagent, stopsw));
	}
	// [ȯ�漳�� > �۾���������] �۾��������� ����Ʈ ���
	private String delWorkServerList(JsonElement jsonElement) throws SQLException, Exception {
		String jobgb 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "jobgb") );
		return gson.toJson(cmm0700.delTab4Info(jobgb));
	}
	
	
	// [ȯ�漳�� > �˸���������] �˸����� ����Ʈ ��������
	private String getNotiList(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0700.getNotiInfo2());
	}
	// [ȯ�漳�� > �˸���������] �˸����� ����Ʈ ��������
	private String getNotiInfo(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0700.getNotiInfo1());
	}
	// [ȯ�漳�� > �˸���������] �˸����� ���
	private String insertNotiInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String smssend 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "smssend") );
		String notiuser = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "notiuser") );
		return gson.toJson(cmm0700.addNotiInfo1(UserId, smssend, notiuser));
	}
	// [ȯ�漳�� > �˸���������] �˸����� ����Ʈ ���
	private String insertNotiList(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String qrycd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "qrycd") );
		String notigbn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "notigbn") );
		String common 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "common") );
		String holiday 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "holiday") );
		return gson.toJson(cmm0700.addNotiInfo2(UserId, qrycd, notigbn, common, holiday));
	}
	// [ȯ�漳�� > �˸���������] �˸����� ����Ʈ ���
	private String delNotiList(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		ArrayList<HashMap<String, String>> delList 	= ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "delList") );
		return gson.toJson(cmm0700.delNotiInfo(UserId, delList));
	}
	
	
	// [ȯ�漳�� > �˸���������] SR�������� �з����������� ��û����üũ ��������
	private String getSrCatType(JsonElement jsonElement) throws SQLException, Exception {
		String cattype 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "cattype") );
		return gson.toJson(cmm0700.getSrCattype(cattype));
	}
	// [ȯ�漳�� > �˸���������] SR�������� �з����������� ��û����üũ ��������
	private String setSrCatType(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> typeList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "typeList") );
		return gson.toJson(cmm0700.setSrCattype(typeList));
	}
	
}
