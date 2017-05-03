import * as mp from "./mapStrings"
import * as mpe from "./mapEnum"
import * as cm from "../entities/client-models"
import * as user from "../entities/user";
import * as student from "./../entities/student";
import * as faculty from "./../entities/faculty";

export class EcLocalDataService {
    static serviceId = 'data.static';

    static milPaygradeGraft: cm.IMilPayGrade = {
        civ: {
            designator: mp.MpPaygrade.civ
        },
        fn: {
            designator: mp.MpPaygrade.fn
        },
        e1: {
            designator: mp.MpPaygrade.e1,
            usaf: {
                rankShortName: 'AB',
                rankLongName: 'Airman Basic'
            },
            usa: {
                rankShortName: 'PVT',
                rankLongName: 'Private'
            },
            usn: {
                rankShortName: 'SR',
                rankLongName: 'Seaman Recurit'
            },
            usmc: {
                rankShortName: 'PVT',
                rankLongName: 'Private'
            }
        },
        e2: {
            designator: mp.MpPaygrade.e2,
            usaf: {
                rankShortName: 'Amn',
                rankLongName: 'Airman'
            },
            usa: {
                rankShortName: 'PV2',
                rankLongName: 'Private Second Class'
            },
            usn: {
                rankShortName: 'SA',
                rankLongName: 'Seaman Apprentice'
            },
            usmc: {
                rankShortName: 'PFC',
                rankLongName: 'Private First Class'
            }
        },
        e3: {
            designator: mp.MpPaygrade.e3,
            usaf: {
                rankShortName: 'A1C',
                rankLongName: 'Airman First Class'
            },
            usa: {
                rankShortName: 'PFC',
                rankLongName: 'Private First Class'
            },
            usn: {
                rankShortName: 'SN',
                rankLongName: 'Seaman'
            },
            usmc: {
                rankShortName: 'LCpl',
                rankLongName: 'Lance Corporal'
            }
        },
        e4: {
            designator: mp.MpPaygrade.e4,
            usaf: {
                rankShortName: 'SrA',
                rankLongName: 'Senior Airman'
            },
            usa: {
                rankShortName: 'CPL',
                rankLongName: 'Corporal'
            },
            usn: {
                rankShortName: 'PO3',
                rankLongName: 'Petty Officer Third Class'
            },
            usmc: {
                rankShortName: 'Cpl',
                rankLongName: 'Corporal'
            }
        },
        e5: {
            designator: mp.MpPaygrade.e5,
            usaf: {
                rankShortName: 'SSgt',
                rankLongName: 'Staff Sergeant'
            },
            usa: {
                rankShortName: 'SGT',
                rankLongName: 'Sergeant'
            },
            usn: {
                rankShortName: 'PO2',
                rankLongName: 'Petty Officer Second Class'
            },
            usmc: {
                rankShortName: 'Sgt',
                rankLongName: 'Sergeant'
            }
        },
        e6: {
            designator: mp.MpPaygrade.e6,
            usaf: {
                rankShortName: 'TSgt',
                rankLongName: 'Technical Sergeant'
            },
            usa: {
                rankShortName: 'SSgt',
                rankLongName: 'Staff Sergeant'
            },
            usn: {
                rankShortName: 'PO1',
                rankLongName: 'Petty Officer First Class'
            },
            usmc: {
                rankShortName: 'SSgt',
                rankLongName: 'Staff Sergeant'
            }
        },
        e7: {
            designator: mp.MpPaygrade.e7,
            usaf: {
                rankShortName: 'MSgt',
                rankLongName: 'Master Sergeant'
            },
            usa: {
                rankShortName: 'SFC',
                rankLongName: 'Sergeant First Class'
            },
            usn: {
                rankShortName: 'CPO',
                rankLongName: 'Chief Petty Officer'
            },
            usmc: {
                rankShortName: 'GySgt',
                rankLongName: 'Gunnery Sergeant'
            }
        },
        e8: {
            designator: mp.MpPaygrade.e8,
            usaf: {
                rankShortName: 'SMSgt',
                rankLongName: 'Senior Master Sergeant'
            },
            usa: {
                rankShortName: 'MSgt',
                rankLongName: 'Master Sergeant'
            },
            usn: {
                rankShortName: 'SCPO',
                rankLongName: 'Senior Chief Petty Officer'
            },
            usmc: {
                rankShortName: 'MSgt',
                rankLongName: 'Master Sergeant'
            }
        },
        e9: {
            designator: mp.MpPaygrade.e9,
            usaf: {
                rankShortName: 'CMSgt',
                rankLongName: 'Chief Master Sergeant'
            },
            usa: {
                rankShortName: 'SGM',
                rankLongName: 'Sergeant Major'
            },
            usn: {
                rankShortName: 'MCPO',
                rankLongName: 'Master Chief Petty Officer'
            },
            usmc: {
                rankShortName: 'MGySgt',
                rankLongName: 'Master Gunnery Sergeant'
            }
        }
    }

    static getSalutation(paygrade: string, component: string, affiliation: string): string {
        const paygradeList = EcLocalDataService.milPaygradeGraft;
        
        if (!paygrade) {
            return "NPG";
        }

        if (paygrade === mp.MpPaygrade.civ) {
            return 'Civ';
        }

        if (paygrade === mp.MpPaygrade.fn) {
            return 'FN';
        }

        if (!component) {
            return paygrade;
        }

        const pg = paygrade.toLowerCase();

        if (!paygradeList.hasOwnProperty(pg)) {
            return '';
        }

        if (Object.assign(paygradeList[pg]) && paygradeList[pg].designator === paygrade) {

            switch (affiliation) {
            case mp.MpAffiliation.usa:
                    return paygradeList[pg].usa.rankShortName;
            case mp.MpAffiliation.usaf:
                    return paygradeList[pg].usaf.rankShortName;
            case mp.MpAffiliation.usn:
            case mp.MpAffiliation.uscg:
                    return paygradeList[pg].usn.rankShortName;
            case mp.MpAffiliation.usmc:
                    return paygradeList[pg].usmc.rankShortName;
            default:
                return 'Unknown';
            }
        }
        return '';
    }

    static prettyInstituteRole(role: string): string {
        switch (role) {
            case mp.MpInstituteRole.student:
                return 'Student';
            case mp.MpInstituteRole.faculty:
                return 'Facilatator';
            case mp.MpInstituteRole.external:
                return 'External User';
            default:
                return 'Unmapped Role';
        }
    }

    static prettifyItemResponse(itemResponse: string): string {
        switch (itemResponse) {
        case 'IEA':
            return 'Always: Ineffective';
        case 'IEU':
            return 'Usually: Ineffective';
        case 'EA':
            return 'Always: Effective';
        case 'EU':
            return 'Usually: Effective';
        case 'HEU':
            return 'Usually: Highly Effective';
        case 'HEA':
            return 'Always: Highly Effective';
        case 'ND':
            return 'Not Displayed';
        default:
            return 'Unknown';
        }
    }

    static avgScore(myResponses: Array<student.SpResponse>): string {
        let sumOfReponses = 0;

        myResponses.forEach(response => {
            sumOfReponses += response.itemModelScore;
        });

        const score = sumOfReponses / myResponses.length;

        if (score <= 0) return mp.MpSpResult.ie;
        if (score < 1) return mp.MpSpResult.bae;
        if (score < 2) return mp.MpSpResult.e;
        if (score < 3) return mp.MpSpResult.aae;
        if (score < 4) return mp.MpSpResult.he;
        return 'Out of range';
    }

    static breakDownCalculation(boItem: any): string {
        let totalBo = 0;
        let totalCount = 0;

        if (boItem.IEA) {
            totalBo += mpe.CompositeModelScore.iea * boItem.IEA;
            totalCount += boItem.IEA;
        }
        if (boItem.IEU) {
            totalBo += mpe.CompositeModelScore.ieu * boItem.IEU;
            totalCount += boItem.IEU;
        }
        if (boItem.EA) {
            totalBo += mpe.CompositeModelScore.ea * boItem.EA;
            totalCount += boItem.EA;
        }
        if (boItem.EU) {
            totalBo += mpe.CompositeModelScore.eu * boItem.EU;
            totalCount += boItem.EU;
        }
        if (boItem.HEA) {
            totalBo += mpe.CompositeModelScore.hea * boItem.HEA;
            totalCount += boItem.HEA;
        }
        if (boItem.HEU) {
            totalBo += mpe.CompositeModelScore.heu * boItem.HEU;
            totalCount += boItem.HEU;
        }
        if (boItem.ND) {
            totalBo += mpe.CompositeModelScore.nd * boItem.ND;
            totalCount += boItem.ND;
        }

        const response = Math.round(totalBo / totalCount);
        let itemResponse = '';
        switch (response) {
        case  mpe.CompositeModelScore.ieu:
                itemResponse = mp.MpSpItemResponse.ieu;
                break;
        case mpe.CompositeModelScore.iea:
            itemResponse = mp.MpSpItemResponse.iea;
            break;
        case mpe.CompositeModelScore.ea:
            itemResponse = mp.MpSpItemResponse.ea;
            break;
        case mpe.CompositeModelScore.eu:
            itemResponse = mp.MpSpItemResponse.eu;
            break;
        case mpe.CompositeModelScore.hea:
            itemResponse = mp.MpSpItemResponse.hea;
            break;
        case mpe.CompositeModelScore.heu:
            itemResponse = mp.MpSpItemResponse.heu;
            break;
        case mpe.CompositeModelScore.nd:
            itemResponse = mp.MpSpItemResponse.nd;
            break;
        default:
            itemResponse = null;
        }

        return (itemResponse) ? EcLocalDataService.prettifyItemResponse(itemResponse) : 'Out of Range';
    }


    static rationaleScore(myResponses: Array<student.SpResponse>): string {
        const totalCount = myResponses.length;
        const breakdown = {
            iea: 0,
            ieu: 0,
            ea: 0,
            eu: 0,
            hea: 0,
            heu: 0,
            nd: 0
        }
        myResponses.forEach(response => {
            switch (response.itemModelScore) {
            case mpe.CompositeModelScore.iea:
                breakdown.iea += 1;
                break;
            case mpe.CompositeModelScore.ieu:
                breakdown.ieu += 1;
                break;
            case mpe.CompositeModelScore.eu:
                breakdown.eu += 1;
                break;
            case mpe.CompositeModelScore.ea:
                breakdown.ea += 1;
                break;
            case mpe.CompositeModelScore.heu:
                breakdown.heu += 1;
                break;
            case mpe.CompositeModelScore.hea:
                breakdown.hea += 1;
                break;
            }
        });
        let precentHighEff = (breakdown.hea + breakdown.heu) / totalCount;
        let precentAboveAvgEff = (breakdown.heu + breakdown.ea) / totalCount;
        let precentIneff = (breakdown.iea + breakdown.ieu + breakdown.nd) / totalCount;
        let precentBelowEff = (breakdown.nd + breakdown.eu) / totalCount;
        precentHighEff = Math.round(precentHighEff);
        precentAboveAvgEff = Math.round(precentAboveAvgEff);
        precentIneff = Math.round(precentIneff);
        precentBelowEff = Math.round(precentBelowEff);

        if (precentHighEff > 90) return mp.MpSpResult.he;
        if (precentAboveAvgEff > 75) return mp.MpSpResult.aae;
        if (precentIneff > 80) return mp.MpSpResult.ie;
        if (precentBelowEff > 70) return mp.MpSpResult.bae;
        return mp.MpSpResult.e;
    }

    milPaygradeGraft: cm.IMilPayGrade;
    
    constructor() {
        this.milPaygradeGraft = EcLocalDataService.milPaygradeGraft;
    }
    
    get edLevels(): Array<string> {
        const edlevels = [];
        const lclEdLevel = mp.MpEdLevel;
        for (let edl in lclEdLevel) {
            if (lclEdLevel.hasOwnProperty(edl)) {
                edlevels.push(lclEdLevel[edl]);
            }
        }
        return edlevels;
    }

    getSalutation(paygrade: string, component: string, affiliation: string): string {
        return EcLocalDataService.getSalutation(paygrade, component, affiliation);
    }

    get milAffil(): Array<{ prop: string, value: string }> {
        const affilArray = [];
        const affiliations = mp.MpAffiliation;
        for (let prop in affiliations) {
            if (affiliations.hasOwnProperty(prop)) {
                affilArray.push({ prop: prop, value: affiliations[prop] });
            }
        }
        return affilArray;
    }

    get milComponent(): Array<{ prop: string, value: string }> {
        const componentArray = [];
        const components = mp.MpComponent;
        for (let prop in components) {
            if (components.hasOwnProperty(prop)) {
                componentArray.push({ prop: prop, value: components[prop] });
            }
        }
        return componentArray;
    }

    get milPaygradeList(): Array<{ prop: string, value: string }> {
        const paygradeArray = [];
        const paygrades = mp.MpPaygrade;
        for (let prop in paygrades) {
            if (paygrades.hasOwnProperty(prop)) {
                paygradeArray.push({ prop: paygrades[prop], value: paygrades[prop] });
            }
        }
        return paygradeArray;
    }

    updatePayGradeList = (user: user.Person): { user: user.Person, paygradelist: Array<{ prop: string, value: string }> } => {

        const payGradeList: Array<{ prop: string, value: string }> = [];

        const milPayGrade = this.milPaygradeGraft;

        if (!user || !user.mpAffiliation) {

            for (let grade in milPayGrade) {

                if (milPayGrade.hasOwnProperty(grade)) {
                    if (milPayGrade[grade] === null) return;

                    const designator = milPayGrade[grade]['designator'];
                    payGradeList.push(
                        {
                            prop: designator,
                            value: designator
                        });
                }
            }
            return { user: user, paygradelist: payGradeList };
        } else {
            user.mpComponent = user.mpAffiliation === mp.MpAffiliation.none ? mp.MpComponent.none : user.mpComponent;

            user.mpPaygrade = user.mpAffiliation === mp.MpAffiliation.none ? this.milPaygradeGraft.civ.designator : user.mpPaygrade;

            const selectedAffiliation = user.mpAffiliation === mp.MpAffiliation.uscg ? mp.MpAffiliation.usn : user.mpAffiliation === mp.MpAffiliation.none ? this.milPaygradeGraft.civ.designator : user.mpAffiliation;

            const affilList = mp.MpAffiliation;

            let affilKey: string;
            for (let affil in affilList) {
                if (affilList.hasOwnProperty(affil)) {
                    if (affilList[affil] === selectedAffiliation) {
                        affilKey = affil;
                    }
                }
            }

            for (let grade in milPayGrade) {
                if (milPayGrade.hasOwnProperty(grade)) {

                    if (milPayGrade[grade] === null) return;

                    const designator = milPayGrade[grade]['designator'];

                    const displayName = (affilKey && milPayGrade[grade][affilKey]) ? `${milPayGrade[grade]['designator']}: ${milPayGrade[grade][affilKey]['rankLongName']}` : milPayGrade[grade]['designator'];
                    payGradeList.push(
                        {
                            prop: designator,
                            value: displayName
                        });
                }
            }
        }
        return { user: user, paygradelist: payGradeList };
    }
    


}
