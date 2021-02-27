class MockShare {
  async share(opt: {
    title: string;
    text: string;
    url: string;
    dialogTitle: string;
  }): Promise<{ activityType: string | undefined }> {
    return { activityType: 'test' };
  }
}

const Share = new MockShare();

export { Share };
