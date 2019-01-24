import com.structurizr.Workspace;
import com.structurizr.api.StructurizrClient;
import com.structurizr.documentation.Format;
import com.structurizr.documentation.StructurizrDocumentationTemplate;
import com.structurizr.model.*;
import com.structurizr.view.*;

/**
 * Simple class for manually constructing diagrams
 */
public class Structurizr {

    private static final String DATABASE_TAG = "Database";
    private static final String NETWORK_TAG = "Network";
    private static final String EXISTING_SYSTEM_TAG = "Existing System";

    public static void main(String[] args) throws Exception {
        // a Structurizr workspace is the wrapper for a software architecture model,
        // views and documentation
        Workspace workspace = new Workspace("The Galactic Council",
                "System which makes it possible to use custom hardware input devices with Empty Epsilon.");
        Model model = workspace.getModel();

        model.setEnterprise(new Enterprise("The Galactic Council"));

        // add some elements to your software architecture model
        Person user = model.addPerson(Location.External, "Bridge Officer", "Bridge Officer of the spaceship");

        SoftwareSystem softwareSystem = model.addSoftwareSystem(Location.Internal, "Space Bridge",
                "Software system that turns HW inputs into reality.");
        SoftwareSystem hardwareBoard = model.addSoftwareSystem(Location.Internal, "Command station hardware",
                "Actual physical control board through which the bridge officer gives his input.");
        SoftwareSystem emptyEpsilon = model.addSoftwareSystem(Location.External, "Empty Epsilon",
                "Open source spaceship command bridge simulator.");

        emptyEpsilon.addTags(EXISTING_SYSTEM_TAG);

        // Define software system connections
        user.uses(hardwareBoard, "Uses");
        softwareSystem.uses(hardwareBoard, "Reads state");
        softwareSystem.uses(emptyEpsilon, "Sends commands to");

        // Space Bridge containers
        Container hwReader = softwareSystem.addContainer("HW Reader",
                "Translates HW input into events and relays them further.", "Python");
        Container hwEffectEngine = softwareSystem.addContainer("HW Effect Engine",
                "Runs effects on hardware based on read events", "Python");
        Container shipControl = softwareSystem.addContainer("Ship Control",
                "Listens for control events, has necessary logic to translate those into Empty Epsilon control values and post those to Empty Epsilon client.",
                "Node.js");
        Container shipWatch = softwareSystem.addContainer("Ship Watch",
                "Monitors EmptyEpsilon's state and generates events on changes", "Node.js");
        Container eventBus = softwareSystem.addContainer("Event Bus", "LAN", "UDP Broadcast");
        eventBus.addTags(NETWORK_TAG);

        // Ship Control components
        Component eventReceiver = shipControl.addComponent("Event Receiver", "Receives events from network.", "event receiver");
        Component eventValidator = shipControl.addComponent("Event Validator", "Validates event format.", "validator");
        Component stationChecker = shipControl.addComponent("Station Checker", "Validates event is for current station.", "checker");
        Component requestCreator = shipControl.addComponent("Request Creator", "Creates requests to send to EmptyEpsilon.", "request creator");
        Component requestSender = shipControl.addComponent("Request Sender", "Sends created requests to EmptyEpsilon.", "sender");

        // Relations between Ship Control components
        eventReceiver.uses(eventValidator, "Passes received events to Event Validator.");
        eventValidator.uses(stationChecker, "Asks if event is valid for current station.");
        eventValidator.uses(requestCreator, "Passes event data to request creator.");
        requestCreator.uses(requestSender, "Sends requests to EmptyEpsilon.");

        // Relations within containers
        hwReader.uses(eventBus, "Broadcasts events", "UDP Broadcast");
        shipControl.uses(eventBus, "Listens for events", "UDP Broadcast");
        shipWatch.uses(eventBus, "Broadcasts events", "UDP Broadcast");
        hwEffectEngine.uses(eventBus, "Listens for event", "UDP Broadcast");

        // Relations to outside systems
        shipControl.uses(emptyEpsilon, "Posts control values and read necessary spaceship properties", "HTTP");
        hwReader.uses(hardwareBoard, "Reads HW input values", "Raspberry HW");
        shipWatch.uses(emptyEpsilon, "Queries spaceship and space state", "HTTP");
        hwEffectEngine.uses(hardwareBoard, "Lights up effects", "Raspberry HW");

        // define some views
        ViewSet views = workspace.getViews();
        SystemContextView contextView = views.createSystemContextView(softwareSystem, "SystemContext",
                "A System Context diagram of Space Bridge.");
        contextView.setPaperSize(PaperSize.A5_Portrait);
        contextView.addAllSoftwareSystems();
        contextView.addAllPeople();

        ContainerView spaceBridgeContainerView = views.createContainerView(softwareSystem,
                "Space Bridge container diagram", "The container diagram for the Space Bridge");
        spaceBridgeContainerView.setPaperSize(PaperSize.A4_Portrait);
        spaceBridgeContainerView.addAllContainersAndInfluencers();

        ComponentView shipControlComponentView = views.createComponentView(shipControl, "Ship Control component diagram", "The component diagram for Ship Control");
        shipControlComponentView.setPaperSize(PaperSize.A4_Portrait);
        shipControlComponentView.addAllComponents();


        // add some documentation
        StructurizrDocumentationTemplate template = new StructurizrDocumentationTemplate(workspace);
        template.addContextSection(softwareSystem, Format.Markdown,
                "Here is some context about the software system...\n" + "\n" + "![](embed:SystemContext)");

        // add some styling
        Styles styles = views.getConfiguration().getStyles();
        styles.addElementStyle(Tags.COMPONENT).background("#cb8150").color("#ffffff");
        styles.addElementStyle(Tags.SOFTWARE_SYSTEM).background("#1168bd").color("#ffffff");
        styles.addElementStyle(Tags.CONTAINER).background("#1168bd").color("#ffffff");
        styles.addElementStyle(Tags.PERSON).background("#08427b").color("#ffffff").shape(Shape.Person);
        styles.addElementStyle(EXISTING_SYSTEM_TAG).background("#999999");
        styles.addElementStyle(DATABASE_TAG).shape(Shape.Cylinder);
        styles.addElementStyle(NETWORK_TAG).shape(Shape.Circle).background("#cbcbcb").color("#ffffff");

        uploadWorkspaceToStructurizr(workspace);
    }

    private static void uploadWorkspaceToStructurizr(Workspace workspace) throws Exception {
        final long WORKSPACE_ID = Long.parseLong(System.getenv("STRUCTURIZR_WORKSPACE_ID"));
        final String API_KEY = System.getenv("STRUCTURIZR_API_KEY");
        final String API_SECRET = System.getenv("STRUCTURIZR_API_SECRET");
        StructurizrClient structurizrClient = new StructurizrClient(API_KEY, API_SECRET);

        structurizrClient.putWorkspace(WORKSPACE_ID, workspace);
    }
}
