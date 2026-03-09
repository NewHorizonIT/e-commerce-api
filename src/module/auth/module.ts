// Initialize module and wire adapter, port, and router together
/*
  Example:
  class <NameModule> {
    public router: Router;

    constructor(
      private <name>Adapter: I<Name>Port,
    ) {
      this.router = this.createRouter();
    }

    private createRouter(): Router {
      const router = Router();

      // Define routes and handlers here

      return router;
    }
  }
*/
