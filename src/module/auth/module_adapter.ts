// Implement adapter of module

/*
  Example:
  class <NameAdapter> implements I<NamePort> {
    constructor(private userRepository: IUserRepository) {}

    async getUserById(id: string): Promise<User | null> {
      return this.userRepository.findById(id);
    }
  }

*/
