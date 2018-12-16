Notaatiosta:
    Jokaisen kohdan alussa kerrotaan inputin tarkoitus pelissä
    (sen perässä kaarisulkeissa alkuperäinen UI-komponentti)
    [ja lopussa hakasulkeissa mahdollisia muita huomatuksia]

    Jokainen asema on jaoteltu loogisiin kokonaisuuksiin, joiden toiminnot liittyvät vahvasti toisiinsa. Näiden osioiden alkuperäiset UI-komponentit ovat ryhmitelty yhteen, mikä lienee hyvä lähtökohta myös fyysisiin ohjainlaitteisiin.

    Input-tyypit on kategorisoitu lennosta alkuperäisten UI-komponenttien perusteella. Samoille tyypeille lienee useimmissa tapauksissa järkevää tehdä samankaltainen fyysinen totetus. Näihin toteutuksiin ei oteta tässä dokumentissa kantaa.

    Cycle/Pick:
        Arvoja, joita voi vaihtaa nuolia klikkailemalla kunnes löytää sopivan. Vaihtoehtoisesti voi klikata itse tekstiä, jolloin avautuu lista kaikista vaihtoehdoista. Niistä voi valita minkä tahansa klikkaamalla.

    Pick:
        Pelkkä listan avaaminen ja oikean vaihtoehdon klikkaaminen.

    Toggle:
        Vaihtaa jotakin true/false arvoa, monesti myös klikattavan painikkeen teksti muuttuu. Toivotaan, että kyseinen muutos on automaattinen myös ulkoista ohjainlaitetta käytettäessä UI-komponentin sijaan.

    Select:
        Painiketta klikkaamalla se tulee valituksi jonkin muun toiminnon avuksi.

    Click:
        Painiketta painamalla tapahtuu Jotain, ja se on aina sama Jotain, esim. ampuminen. Painike täytyy jotenkin pystyä valitsemaan ensin. Hiirellä hoveraaminen korostaa painikkeen, kenties tätä kautta pääsee kiinni?

    Click/Hold:
        Pohjassa pitäminen lähettää jatkuvasti uusia komentoja, käytetään lähinnä aluksen ohjaamiseen.

    Slider:
        Liukusäädin

    Scrollbar:
        Näkymässä on vierityspalkki. Useassa tapauksessa palkkia ei tarvita tekstin vähyydestä johtuen, mutta joskus tarvitaan.


Yleiset: 
    [Näitä kaikkia ei välttämättä ole mielekästä toteuttaa fyysisenä, mutta ne kaikki listataan tähän siitä huolimatta.]

    -self destruct (numerot 0-9, clear, ok) [Kaikki nämä painikkeet toimivat input-tyypillä Click]
    -pause/unpause (ei komponenttia pauseen, unpauseen Click)
    -destroyed -ruudun return (Click)

Engineering:
    Self destruct:
        -init self destruct (Toggle)
        -confirm self destruct (Click)

    Moduulien virta/jäähdytys:
        -moduulin valinta (Select)
        -virranjako (Slider)
        -jäähdytysnesteen annostelu (Slider)

    Teknikoiden ohjaus:
        -teknikon valinta (Select) [Teknikot pysyvät valittuna kunnes valitaan jokin toinen teknikko.]
        -kohdehuoneen valinta (Click)

Helm:
    Perusliike:
        -suunta (Click/Hold)
        -impulssinopeus (Slider)

    Erityisliike:
        Jump:
            -etäisyysvalinta (Slider)
            -aktivointi (Click)
        
        Warp:
            -tehovalinta (Slider) [tavallisesta poiketen säädin on vain 5-portainen]

    Väistöliikkeet:
        -combat maneuver (Click/Hold) [Pohjassa pitäminen oleellisempaa kuin suunnan valinnassa. Ohjausalue 180° aluksen edessä.]

Relay:
    Hälytystaso:
        -hälytystason valinta (Pick)

    Näkymän mukautus:
        -kartan zoomaus (Slider) [1.0-8.0, säätö 0.1 askelin]

    Painikkeet:
        -comms (Click) [Vaatii valitun aluksen/aseman tms.]
        -start hacking (Click)
        -link to science (Click) [Vaatii valitun proben]
        -place waypoint (Select) [Siirtyy waypointin asetus -tilaan, jonka jälkeen klikataan karttaa]
        -delete waypoint (Click) [Vaatii valitun waypointin]
        -launch probe (Select) [Siirtyy proben lähetys -tilaan, jonka jälkeen klikataan karttaa]
        -kommunikaatiohistoria (Toggle) [Laatikon painaminen avaa laatikon suureksi, uudelleen painaminen pienentää alareunaan]

    Kartta:
        -kohteiden valitseminen (Select) [Tämä vaatii järkevän tavan valita kohde kartalta]
        -waypointin/luotaimen asetus [Tämäkin vaatii jonkin klikkauksen tyylisen]

    Comms:
        -avaamisen keskeytys (Click)
        -valikon selaaminen (Scrollbar)
        -keskusteluvaihtoehdon valitseminen (Click)
        -keskusteluikkunan sulkeminen (Click)

Science:
    Yleisnäkymä:
        -probe view (Click) [Vaatii Relayn linkittämän proben]
        -radar (Click)
        -database (Click)

    Karttanäkymä:
        -kohteiden valitseminen (Click)
        -kohteen näytettävien tietojen valinta (Toggle)
        -tietokannan avaus valitun kohteen sijainnista (Click)
        -zoomaus (Slider) [1.0-6.0, säätö 0.1 askelin]

    Tietokantanäkymä:
        -vaihtoehdon valinta (Click)
        -vaihtoehtolistan vieritys (Scrollbar)
        -kohteen kuvauksen vieritys (Scrollbar)

Weapons:
    Putket:
        -ammustyypin valinta, jokaiselle oma (Select)
        -load/unload (Toggle) [aluksen putkien lkm, min/max?]
        -ammuksen laukaisu (Click)

    Tuikuttimet:
        -kohteen valinta (Cycle/Pick)
        -taajuusvalinta (Cycle/Pick)
    
    Kilvet:
        -kilpien aktivointi (Toggle)
        -kilpien kalibrointi (Cycle/Pick)

    Tähtäys:
        -lock/unlock (Toggle)
        -360° tähtäys
