/**
 * Created by steve on 14-12-24.
 */

cityareaname=new Array(35);
cityareacode=new Array(35);
function first(preP,preC,formname,selectP,selectC)
{
    a=0;
    if (selectP=='01')
    { a=1;tempoption=new Option('北京','北京',false,true); }
    else
    { tempoption=new Option('北京','北京'); }
    eval('document.'+formname+'.'+preP+'.options[1]=tempoption;');
    cityareacode[0]=new Array('5498007cc66e4e4c45f092cb','5497c0304e48606e1cb21ec1','549809bcc66e4e4c45f09317','5497ff0ac66e4e4c45f092c7');
    cityareaname[0]=new Array('中国人民解放军海军总医院','北京同仁医院','北京大学第一医院','中国人民解放军总医院301医院');
    if (selectP=='02')
    { a=2;tempoption=new Option('天津市','天津市',false,true); }
    else
    { tempoption=new Option('天津市','天津市'); }
    eval('document.'+formname+'.'+preP+'.options[2]=tempoption;');
    cityareacode[1]=new Array('5498054ec66e4e4c45f092f8','549805b5c66e4e4c45f092f9','549807ccc66e4e4c45f09307');
    cityareaname[1]=new Array('天津市环湖医院','天津市整形外科医院','天津市第一中心医院');
    if (selectP=='03')
    { a=3;tempoption=new Option('武汉','武汉',false,true); }
    else
    { tempoption=new Option('武汉','武汉'); }
    eval('document.'+formname+'.'+preP+'.options[3]=tempoption;');
    cityareacode[2]=new Array('5498095fc66e4e4c45f09315');
    cityareaname[2]=new Array('同济医院');
    if (selectP=='04')
    { a=4;tempoption=new Option('上海','上海',false,true); }
    else
    { tempoption=new Option('上海','上海'); }
    eval('document.'+formname+'.'+preP+'.options[4]=tempoption;');
    cityareacode[3]=new Array('54980924c66e4e4c45f09312','54981250c66e4e4c45f093e8');
    cityareaname[3]=new Array('上海瑞金医院','上海国际医学中心');
    if (selectP=='05')
    { a=5;tempoption=new Option('广州','广州',false,true); }
    else
    { tempoption=new Option('广州','广州'); }
    eval('document.'+formname+'.'+preP+'.options[5]=tempoption;');
    cityareacode[4]=new Array('549812a2c66e4e4c45f093eb','54980d51c66e4e4c45f09364');
    cityareaname[4]=new Array('中山大学附属第三医院','广州中医药大学第一附属医院');
    if (cityid!='0')
    {
        b=0;for (i=0;i<cityareaname[cityid-1].length;i++)
    {
        if (selectC==cityareacode[cityid-1][i])
        {b=i+1;tempoption=new Option(cityareaname[cityid-1][i],cityareacode[cityid-1][i],false,true);}
        else
            tempoption=new Option(cityareaname[cityid-1][i],cityareacode[cityid-1][i]);
        eval('document.'+formname+'.'+preC+'.options[i+1]=tempoption;');
    }
        eval('document.'+formname+'.'+preC+'.options[b].selected=true;');
    }
}
function selectcityarea(preP,preC,formname)
{
    cityid=eval('document.'+formname+'.'+preP+'.selectedIndex;');
    j=eval('document.'+formname+'.'+preC+'.length;');
    for (i=1;i<j;i++)
    {eval('document.'+formname+'.'+preC+'.options[j-i]=null;')}
    if (cityid!="0")
    {
        for (i=0;i<cityareaname[cityid-1].length;i++)
        {
            tempoption=new Option(cityareaname[cityid-1][i],cityareacode[cityid-1][i]);
            eval('document.'+formname+'.'+preC+'.options[i+1]=tempoption;');
        }
    }
}