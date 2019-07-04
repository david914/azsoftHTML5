var clickedPrjInfo;
var cboQryGbnData;

getCboElementPrj();

function SRRegisterTabInit(initDivision){
	//elementInit(initDivision);
}

function getCboElementPrj() {
	var codeInfos = getCodeInfoCommon( [new CodeInfo('QRYGBN','ALL','N')] );
	cboQryGbnData 	= codeInfos.QRYGBN;
}
